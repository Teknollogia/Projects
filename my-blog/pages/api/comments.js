import { fetchComments, addComment, deleteComment } from '../../lib/server/db';
import oracledb from "oracledb";

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

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { postId } = req.query;
        if (!postId) {
            return res.status(400).json({ error: 'postId is required' });
        }
        try {
            const comments = await fetchComments(postId);
            res.status(200).json(comments);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch comments: ' + err.message });
        }
    } else if (req.method === 'POST') {
        const { postId, userId, content } = req.body;
        if (!postId || !userId || !content) {
            return res.status(400).json({ error: 'postId, userId, and content are required' });
        }
        try {
            let connection;
            try {
                connection = await getConnection();
                const result = await connection.execute(
                    `SELECT username FROM users WHERE id = :userId`,
                    { userId },
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );
                if (result.rows.length === 0) {
                    throw new Error('User not found');
                }
                const username = result.rows[0].USERNAME;
                const newComment = await addComment(postId, userId, username, content);
                res.status(201).json(newComment);
            } finally {
                if (connection) await connection.close();
            }
        } catch (err) {
            res.status(500).json({ error: 'Failed to add comment: ' + err.message });
        }
    } else if (req.method === 'DELETE') {
        const { commentId, userId, userRole } = req.body;
        if (!commentId || !userId || !userRole) {
            return res.status(400).json({ error: 'commentId, userId, and userRole are required' });
        }
        try {
            await deleteComment(commentId, userId, userRole);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(403).json({ error: 'Failed to delete comment: ' + err.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}