import '../styles/global.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';


const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [user, router.pathname]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <main>
            <Component {...pageProps} />
          </main>
          <Sidebar />
        </div>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}