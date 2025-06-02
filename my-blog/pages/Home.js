import Head from 'next/head';
import BlogPost from '../components/BlogPost';
import Comment from '../components/Comment';
import Sidebar from '../components/Sidebar';
import EditableTable from '../components/EditableTable';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';


export async function getServerSideProps(context) {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = context.req.headers.host;
  const res = await fetch(`${protocol}://${host}/api/posts`);
  const data = await res.json();

  return { props: { posts: Array.isArray(data) ? data : [] } };
}

export default function Home({ posts }) {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  }

  function toggleFavorite(id, title) {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(fav => fav.id === id)) {
        return prevFavorites.filter(fav => fav.id !== id);
      } else {
        return [...prevFavorites, { id, title }];
      }
    });
  }

  const renderContent = (post) => {
    if (post.image) {
      return <Image src={post.image} alt={post.title} width={500} height={300} />;
    }
    return <p>{post.content}</p>;
  };

  const renderFullContent = (post) => {
    if (post.hasEditableTable) {
      return (
        <>
          <div>{post.fullContent}</div>
          <EditableTable />
        </>
      );
    }
    if (post.image) {
      return (
        <>
          <Image src={post.image} alt={post.title} width={500} height={300} />
          <p>{post.fullContent}</p>
        </>
      );
    }
    if (post.fullContent && post.fullContent.includes('<table')) {
      return (
        <>
          <div>{post.fullContent.split('<table')[0]}</div>
          <table border="1">
            <tbody>
              <tr>
                <th>Év</th>
                <th>Fejlődési mérföldkő</th>
              </tr>
              <tr>
                <td>2020</td>
                <td>GPT-3 megjelenése</td>
              </tr>
              <tr>
                <td>2023</td>
                <td>GPT-4 fejlesztése és elterjedése</td>
              </tr>
              <tr>
                <td>2025</td>
                <td>AI által generált teljes filmek</td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }
    if (post.fullContent && post.fullContent.includes('<ul')) {
      return (
        <>
          <div>{post.fullContent.split('<ul')[0]}</div>
          <ul>
            <li>Előnyök: nagyobb rugalmasság, élménygazdag élet</li>
            <li>Kihívások: a munka és a szabadidő közötti egyensúly megtalálása</li>
          </ul>
        </>
      );
    }
    return <div>{post.fullContent || post.content}</div>;
  };

  return (
    <main className="home">
      <Head>
        <title>Home - Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1> Welcome {user?.username} </h1>
      {user && (
          <button onClick = {handleLogout} className = "logout-button">
            Log Out
          </button>
      )}

      <section className="blogPosts">
        {posts.map((post) => (
          <div key={post.id}>
            <BlogPost
              id={post.id}
              title={post.title}
              time={post.time}
              content={renderContent(post)}
              fullContent={renderFullContent(post)}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.some(fav => fav.id === post.id)}
            />
            <Comment
              postId={post.id}
              user={user} 
            />
          </div>
        ))}
      </section>
      
      <aside style={{ flex: 1 }}>
          <Sidebar favorites={favorites} />
      </aside>
    </main>
  );
}