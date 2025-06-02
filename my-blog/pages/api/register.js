import { registerUser } from '../../lib/server/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, email, password } = req.body;

  try {
    await registerUser(username, email, password);
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
