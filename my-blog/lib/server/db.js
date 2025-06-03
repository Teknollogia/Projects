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
      `SELECT id, title, time, content, image, fullcontent, hasEditableTable FROM posts`,
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

async function addPost(title, content, fullContent, image, hasEditableTable) {
    let connection;
    try {
        connection = await getConnection();
        const id = `post_${Date.now()}`;
        await connection.execute(
            `INSERT INTO posts (id, title, time, content, image, fullContent, hasEditableTable)
            VALUES (:id, :title, SYSDATE, :content, :image, :fullContent, :hasEditableTable)`,
            {
                id,
                title,
                content,
                image: image || null,
                fullContent: fullContent || null,
                hasEditableTable: hasEditableTable ? 1 : 0,
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

async function findUserByEmail(email) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT id, username, email, password FROM users WHERE email = :email`,
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

export { fetchPosts, addPost, registerUser, findUserByEmail };