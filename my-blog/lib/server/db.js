import bcrypt from 'bcrypt';
import oracledb from 'oracledb';

async function getConnection() {
  
  try {
    const oracledb = require('oracledb');
    const libDir = process.env.INSTANT_CLIENT_PATH || 'C:\\oracle\\instantclient_23_6';
    oracledb.initOracleClient({ libDir });

    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });
    console.log('Successfully connected to Oracle Database');
    return connection;
  } catch (err) {
    console.error('Error connecting to Oracle Database:', err);
    throw err;
  }
}

async function clobToString(clob) {
  if (!clob) return null;
  return new Promise((resolve, reject) => {
    let data = '';
    clob.setEncoding('utf8');
    clob.on('data', chunk => {
      data += chunk;
    });
    clob.on('end', () => {
      console.log('CLOB converted to string:', data);
      resolve(data);
    });
    clob.on('error', err => {
      console.error('Error converting CLOB to string:', err);
      reject(err);
    });
  });
}

async function fetchPosts() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT id, title, time, content, image, fullcontent, hasEditableTable, user_id FROM posts`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('Raw rows from database:', result.rows);
    if (result.rows.length > 0) {
      console.log('Type of FULLCONTENT:', typeof result.rows[0].FULLCONTENT, result.rows[0].FULLCONTENT);
    }

    const mappedRows = await Promise.all(
      result.rows.map(async (row) => {
        let fullContent = null;
        try {
          fullContent = row.FULLCONTENT ? await clobToString(row.FULLCONTENT) : null;
        } catch (err) {
          console.error('Failed to convert FULLCONTENT for row:', row.ID, err);
          fullContent = null; // Fallback to null if conversion fails
        }
        const mappedRow = {
            id: row.ID ?? null,
            title: row.TITLE ?? null,
            time: row.TIME instanceof Date ? row.TIME.toISOString().split('T')[0] : row.TIME ?? null,
            content: row.CONTENT ?? null,
            image: row.IMAGE ?? null,
            fullContent,
            hasEditableTable: row.HASEDITABLETABLE === 1,
            userId: row.USER_ID ?? null,
        };
        console.log('Mapped row:', mappedRow);
        return mappedRow;
      })
    );

    return mappedRows;
  } catch (err) {
    console.error('Error fetching posts:', err.message, err.stack);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

async function addPost(title, content, fullContent, image, hasEditableTable, userId) {
    let connection;
    try {
        connection = await getConnection();
        const id = `post_${Date.now()}`;
        await connection.execute(
            `INSERT INTO posts (id, title, time, content, image, fullContent, hasEditableTable, user_id)
            VALUES (:id, :title, SYSDATE, :content, :image, :fullContent, :hasEditableTable, :user_id)`,
            {
                id,
                title,
                content,
                image: image || null,
                fullContent: fullContent || null,
                hasEditableTable: hasEditableTable ? 1 : 0,
                user_id: userId || null,
            },
            {autoCommit: true}
        );
        console.log("Post added");
        return {
            id,
            title,
            time: new Date().toISOString(),
            content,
            image,
            fullContent,
            hasEditableTable,
            userId,
        };
    } catch (err) {
        console.error('Error adding post:', err.message);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

async function registerUser(username, email, password) {
  let connection;
  try {
    connection = await getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user_${Date.now()}`;
    const result = await connection.execute(
      `INSERT INTO users (id, username, email, password, created_at) VALUES (:id, :username, :email, :password, SYSDATE)`,
      { id, username, email, password: hashedPassword },
      { autoCommit: true }
    );
    console.log('User successfully registered:', null);
    return {id, username, email};
  } catch (err) {
      console.error('Error registering user:', err.message, err.stack);
      throw err;
  } finally {
      if (connection) {
          try {
              await connection.close();
              console.log('Database connection closed');
          } catch (err) {
              console.error('Error closing connection: ', err);
          }
      }
  }
}

async function deletePost(postId, userId) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT id, title, time, content, image, fullContent, hasEditableTable, user_id
            FROM posts WHERE id = :postId AND user_id = :user_id`,
            {postId, user_id: userId},
            { outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        if(result.rows.length === 0) {
            throw new Error('User not authortized or post not found.');
        }
        const post = result.rows[0];
        await connection.execute(
          `INSERT INTO deleted_posts (id, title, time, content, image, fullContent, hasEditableTable, user_id, deleted_at)
            VALUES (:id, :title, :time, :content, :image, :fullContent, :hasEditableTable, :user_id, SYSDATE)`,
            {
                id: post.ID,
                title: post.TITLE,
                time: post.TIME,
                content: post.CONTENT,
                image: post.IMAGE,
                fullContent: post.FULLCONTENT,
                hasEditableTable: post.HASEDITABLETABLE,
                user_id: post.USER_ID,
            },
            { autoCommit: true }
        );
        await connection.execute(
            `DELETE FROM posts WHERE id = :postId AND user_id = :user_id`,
            {postId, user_id: userId},
            { autoCommit: true }
        );
        console.log('Post deleted and moved to deletd_posts: ', {postId, userId});
        return {success: true};
    } catch (error) {
        console.error('Error deleting post:', error.message);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
}

async function findUserByEmail(email) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT id, username, email, password, role FROM users WHERE email = :email`,
        { email },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (result.rows.length === 0) return null;
      return result.rows[0];
    } catch (err) {
        console.error('Error finding user by email:', err.message, err.stack);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Database connection closed');
            } catch (err) {
                console.error('Error closing connection: ', err);
            }
        }
    }
}

async function fetchComments(postId) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT ID, CONTENT, USERNAME, POSTID, CREATEDAT 
       FROM comments 
       WHERE POSTID = :postId`,
            { postId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const mappedComments = result.rows.map(row => ({
            id: row.ID,
            content: row.CONTENT,
            username: row.USERNAME,
            postId: row.POSTID,
            createdAt: row.CREATEDAT instanceof Date ? row.CREATEDAT.toISOString() : row.CREATEDAT,
        }));

        return mappedComments;
    } catch (err) {
        console.error('Error fetching comments:', err.message, err.stack);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Database connection closed');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

async function addComment(postId, userId, username, content) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `INSERT INTO COMMENTS (ID, POSTID, USER_ID, USERNAME, CONTENT, CREATEDAT) 
       VALUES (:id, :postId, :userId, :username, :content, SYSDATE) 
       RETURNING ID, POSTID, USERNAME, CONTENT, CREATEDAT INTO :outId, :outPostId, :outUsername, :outContent, :outCreatedAt`,
            {
                id: `comment_${Date.now()}`,
                postId,
                userId,
                username,
                content,
                outId: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                outPostId: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                outUsername: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                outContent: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                outCreatedAt: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
            },
            { autoCommit: true }
        );
        return {
            id: result.outBinds.outId,
            postId: result.outBinds.outPostId,
            username: result.outBinds.outUsername,
            content: result.outBinds.outContent,
            createdAt: result.outBinds.outCreatedAt.toISOString(),
        };
    } catch (err) {
        console.error('Error adding comment:', err.message);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

/*async function deleteComment(commentId, userId, userRole) {
    let connection;
    try {
        connection = await getConnection();
        if (userRole !== 'admin') {
            throw new Error('User not authorized!');
        }
        const result = await connection.execute(
            `DELETE FROM comments WHERE user_id = :user_id`,
            { commentId},
            { autoCommit: true }
        );
        if (result.rowsAffected === 0) {
            throw new Error('Comment not found.');
        }
        console.log('Comment deleted: ', {commentId});
        return {success: true};
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}*/

async function deleteComment(commentId, userId, userRole) {
    let connection;
    try {
        connection = await getConnection();
        if (userRole !== 'admin') {
            throw new Error('User not authorized!');
        }

        const result = await connection.execute(
            `SELECT ID, CONTENT, USERNAME, POSTID, CREATEDAT FROM COMMENTS WHERE ID = :commentId`,
            { commentId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if (result.rows.length === 0) {
            throw new Error('Comment not found.');
        }
        const comment = result.rows[0];

        // Debug the CREATEDAT value
        console.log('Fetched comment CREATEDAT:', comment.CREATEDAT);

        // Convert CREATEDAT to a JavaScript Date object, with a fallback
        let createdAt;
        if (comment.CREATEDAT instanceof Date && !isNaN(comment.CREATEDAT)) {
            createdAt = comment.CREATEDAT;
        } else {
            const parsedDate = new Date(comment.CREATEDAT);
            createdAt = !isNaN(parsedDate) ? parsedDate : new Date(); // Fallback to current date
        }

        await connection.execute(
            `INSERT INTO DELETED_COMMENTS (ID, CONTENT, USERNAME, POSTID, CREATEDAT, DELETED_AT) 
       VALUES (:ID, :CONTENT, :USERNAME, :POSTID, :CREATEDAT, SYSDATE)`,
            {
                ID: comment.ID,
                CONTENT: comment.CONTENT,
                USERNAME: comment.USERNAME,
                POSTID: comment.POSTID,
                CREATEDAT: createdAt,
            },
            { autoCommit: true }
        );

        await connection.execute(
            `DELETE FROM COMMENTS WHERE ID = :commentId`,
            { commentId },
            { autoCommit: true }
        );

        console.log('Comment deleted and moved to DELETED_COMMENTS:', { commentId });
        return { success: true };
    } catch (err) {
        console.error('Error deleting comment:', err.message);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Database connection closed');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

export {fetchPosts, addPost, registerUser, deletePost, findUserByEmail, fetchComments, addComment, deleteComment };