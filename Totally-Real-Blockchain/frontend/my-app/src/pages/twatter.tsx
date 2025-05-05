import React, { useEffect, useState } from 'react';
import '../styles/twatter.css';
import '../styles/main.css';

interface Post {
  id: number;
  userName: string;
  header: string;
  content: string;
  createdAt: number;
}

const Twatter: React.FC = () => {
  const [header, setHeader] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://192.168.1.8:8080/twatter/get', {
      });
      const data = await res.json();
      if (res.ok) setPosts(data.posts.reverse()); // newest first
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Not authenticated');

    try {
      const res = await fetch('http://192.168.1.8:8080/twatter/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ header, content }),
      });

      if (res.ok) {
        setHeader('');
        setContent('');
        fetchPosts();
        console.log('Post created successfully!');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to post');
      }
    } catch (err) {
      console.error('Error posting:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="twatter-page">
      <h2>Post something to Twatter</h2>
      <form onSubmit={handlePost} className="twatter-form">
        <input
          type="text"
          placeholder="Post header"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          required
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>

      <h3>Recent Posts</h3>
      <div className="twatter-feed">
        {posts.map((post) => (
        <div className='card' key={post.id}>
          <h4>{post.header}</h4>
          <p>{post.content}</p>
          <span>by @{post.userName}</span>
          <span className="timestamp">
            {new Date(post.createdAt * 1000).toLocaleString()}
          </span>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Twatter;
