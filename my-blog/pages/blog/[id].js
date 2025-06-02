import Head from 'next/head';
import BlogPost from '../../components/BlogPost';
import Comment from '../../components/Comment';
import Sidebar from '@/components/Sidebar';
import EditableTable from '../../components/EditableTable';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { fetchPosts } from '../../lib/server/db';



export async function getStaticPaths() {
  const posts = await fetchPosts(); 

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const posts = await fetchPosts();
  const post = posts.find((p) => p.id === params.id);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
}

export default function BlogPostPage({ post }) {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

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
          <p>{post.fullContent}</p>
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
          <p>{post.fullContent.split('<table')[0]}</p>
          <table border="1">
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
          </table>
        </>
      );
    }
    if (post.fullContent && post.fullContent.includes('<ul')) {
      return (
        <>
          <p>{post.fullContent.split('<ul')[0]}</p>
          <ul>
            <li>Előnyök: nagyobb rugalmasság, élménygazdag élet</li>
            <li>Kihívások: a munka és a szabadidő közötti egyensúly megtalálása</li>
          </ul>
        </>
      );
    }
    return <p>{post.fullContent || post.content}</p>;
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container" style={{ display: 'flex', gap: '2rem' }}>
      <Head>
        <title>{post.title} - Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="blogPosts" style={{ flex: 3 }}>
        <BlogPost
          id={post.id}
          title={post.title}
          time={post.time}
          content={renderContent(post)}
          fullContent={renderFullContent(post)}
          toggleFavorite={toggleFavorite}
          isFavorite={favorites.some(fav => fav.id === post.id)}
          isFullPost
        />
        <Comment />
      </section>

      <aside style={{ flex: 1 }}>
        <Sidebar favorites={favorites} />
      </aside>
    </main>
  );
}