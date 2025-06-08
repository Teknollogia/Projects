import Head from 'next/head';
import BlogPost from '../components/BlogPost';
import Comment from '../components/Comment';
import Sidebar from '../components/Sidebar';
import EditableTable from '../components/EditableTable';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from "@/components/Header";

export async function getServerSideProps(context) {
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = context.req.headers.host;
  const res = await fetch(`${protocol}://${host}/api/posts`);
  const data = await res.json();

  return { props: { initialPosts: Array.isArray(data) ? data : [] } };
}

export default function Home({ initialPosts }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [posts, setPosts] = useState(initialPosts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    fullContent: '',
    image: '',
    hasEditableTable: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      console.log('Home.js - Stored user:', storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const toggleFavorite = (id, title) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === id)) {
        return prevFavorites.filter((fav) => fav.id !== id);
      } else {
        return [...prevFavorites, { id, title }];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert('Title and content are required');
      return;
    }
    if (!user || !user.id) {
      alert('User ID is not available. Please log in again.');
      router.push('/login');
      return;
    }
    try {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = window.location.host;
      const res = await fetch(`${protocol}://${host}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newPost, userId: user.id }),
      });
      const addedPost = await res.json();
      if (res.ok) {
        setPosts([addedPost, ...posts]);
        setShowAddForm(false);
        setNewPost({
          title: '',
          content: '',
          fullContent: '',
          image: '',
          hasEditableTable: false,
        });
      } else {
        alert('Post failed to be added: ' + addedPost.error);
      }
    } catch (err) {
      alert('Error adding post: ' + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = window.location.host;
      const res = await fetch(`${protocol}://${host}/api/posts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user.id }),
      });
      const result = await res.json();
      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        alert('Failed to delete post: ' + result.error);
      }
    } catch (err) {
      alert('Error deleting post: ' + err.message);
    }
  };

  const onDeleteComment = async (commentId) => {
      try {
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = window.location.host;
        const res = await fetch(`${protocol}://${host}/api/comments`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId, userId: user?.id, userRole: user?.role }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Failed to delete comment.');
        }
      } catch (error) {
          throw new Error('Error deleting comment: ' + commentId);
      }

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
        <Header/>
        <h1>Welcome, {user?.username || 'Guest'}</h1>
        {user && (
            <button onClick={handleLogout} className="logout-button">
              Log Out
            </button>
        )}
        {user && (
            <div className="add-post-button">
              <button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancel' : 'Add new post'}
              </button>
            </div>
        )}
        {showAddForm && (
            <div className="add-post-form">
              <h2>Add New Post</h2>
              <form onSubmit={handleAddPost}>
                <div>
                  <label htmlFor="title">Title</label>
                  <input
                      type="text"
                      id="title"
                      name="title"
                      value={newPost.title}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <div>
                  <label htmlFor="content">Content (Short Description)</label>
                  <textarea
                      id="content"
                      name="content"
                      value={newPost.content}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <div>
                  <label htmlFor="fullContent">Full Content (Optional)</label>
                  <textarea
                      id="fullContent"
                      name="fullContent"
                      value={newPost.fullContent}
                      onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="image">Image URL (Optional)</label>
                  <input
                      type="text"
                      id="image"
                      name="image"
                      value={newPost.image}
                      onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>
                    <input
                        type="checkbox"
                        name="hasEditableTable"
                        checked={newPost.hasEditableTable}
                        onChange={handleInputChange}
                    />{' '}
                    Has Editable Table
                  </label>
                </div>
                <button type="submit">Submit Post</button>
              </form>
            </div>
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
                    isFavorite={favorites.some((fav) => fav.id === post.id)}
                    userId={post.userId}
                    currentUserId={user?.id}
                    onDelete={handleDeletePost}
                />
                <Comment postId={post.id} user={user} onDeleteComment={onDeleteComment} />
              </div>
          ))}
        </section>
        <aside style={{ flex: 1 }}>
          <Sidebar favorites={favorites} />
        </aside>
      </main>
  );
}