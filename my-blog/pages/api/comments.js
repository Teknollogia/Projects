import dbConfig from "@/lib/server/dbConfig";
import { getConnection } from "oracledb";
import oracledb from "oracledb";

let commentsStore = [];

export default async function handler(req, res) {
    let connection;
    try {
        connection = await getConnection(dbConfig);

        if (req.method === 'GET') {
            const { postId } = req.query;

            if (!postId) {
                return res.status(400).json({ error: 'Post ID is required' });
            }
            const result = await connection.execute(
                `SELECT id, content, username, postId, createdAt FROM comments WHERE postId = :postId`,
                [postId],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            
            const rows = result.rows || [];
            console.log(rows);
            return res.status(200).json(result.rows.map(row => ({
                id: row[0],
                content: row[1],
                username: row[2],
                postId: row[3],
                createdAt: row[4],
            })));
        }


        if (req.method === 'POST') {
            const { content, username, postId } = req.body;
            if (!content || !username || !postId) {
                return res.status(400).json({ error: 'Content, username, and postId are required' });
            }

            const newComment = {
                id: commentsStore.length + 1,
                content,
                username,
                postId,
                createdAt: new Date(),
            };

            commentsStore.push(newComment);

            const insertResult = await connection.execute(
                `INSERT INTO comments (content, username, postId, createdAt) VALUES (:content, :username, :postId, :createdAt)
                RETURNING id INTO :id`, 
                {
                    content: newComment.content,
                    username: newComment.username,
                    postId: newComment.postId,
                    createdAt: newComment.createdAt,
                    id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
                },
                { autoCommit: true }
            );

            return res.status(201).json({
                id: insertResult.outBinds.id[0],
                content,
                username,
                postId,
                createdAt: new Date().toISOString()
            });
        }
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('Database error: ', err);
        res.status(500).json({ error: 'Internal server error' });
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