import { fetchPosts } from '../../lib/server/db';

export default async function handler(req, res) {
  try {
    const posts = await fetchPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load posts' });
  }
}
