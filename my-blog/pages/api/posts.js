import { fetchPosts, addPost } from '../../lib/server/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const posts = await fetchPosts();
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to load posts' });
    }
  } else if (req.method === 'POST') {
    const { title, content, fullContent, image, hasEditableTable } = req.body;
    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
    }
    try {
      const newPost = await addPost(title, content, fullContent, image, hasEditableTable);
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add post: ' + err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}