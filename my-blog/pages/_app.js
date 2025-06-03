import { createContext, useContext, useState, useEffect } from 'react';
import '../styles/global.css';
import '../styles/login.css';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      console.log('App.js - Stored user:', storedUser); // Debug log
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
      <UserContext.Provider value={{ user, logout }}>
        <Component {...pageProps} />
      </UserContext.Provider>
  );
}