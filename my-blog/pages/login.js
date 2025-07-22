import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import '../styles/global.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isLoginMode) {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json(); // Egyszer olvasunk be
          if (!res.ok) {
            setError(data.message || 'Login failed');
            return;
          }
          console.log('Login - Storing user in localStorage:', data); // Debug log
          setSuccess('Login successful');
          localStorage.setItem('user', JSON.stringify(data));
          setTimeout(() => {
            router.push('/Home');
          }, 1000);
      } else {
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
          });
          if (!res.ok) {
            const data = await res.json();
            setError(data.message || 'Registration failed');
            return;
          }
          setSuccess('Registration successful');
          setIsLoginMode(true);
          setUsername('');
          setEmail('');
          setPassword('');
      }
    } catch (err) {
          setError('An error occurred: ' + err.message);
    }
  };

  return (
      <main className="login-page">
        <Header />
        <Head>
          <title>Blog - {isLoginMode ? 'Login' : 'Register'}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <section className="auth-container">
          <h1>{isLoginMode ? 'Login' : 'Register'}</h1>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
                {!isLoginMode && (
                    <div>
                      <label htmlFor="username">Username</label>
                      <input
                          type="text"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                      />
                    </div>
                )}
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">{isLoginMode ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLoginMode(!isLoginMode)}>
              {isLoginMode ? 'Switch to Register' : 'Switch to Login'}
            </button>
          </div>
        </section>
      </main>
  );
}