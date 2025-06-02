import { findUserByEmail } from '../../lib/server/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    console.log('User found: ', user);

    if (!user || !user.PASSWORD) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }
    const passwordMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({
      id: user.ID,
      username: user.USERNAME,
      email: user.EMAIL,
    });


  } catch (error) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
      console.error('Login error: ', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}