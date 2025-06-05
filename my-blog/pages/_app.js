import '../styles/global.css';
import '../styles/login.css';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('App.js - Stored user:', parsedUser); // Ellenőrizzük a teljes objektumot
      setUser(parsedUser);
    }
  }, []);

  return <Component {...pageProps} user={user} />;
}

export default MyApp;