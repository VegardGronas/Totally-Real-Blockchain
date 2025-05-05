import React, { use, useEffect, useState } from 'react';
import '../styles/dashboard.css';
import '../styles/twatter.css';

const rootAddress = 'http://192.168.1.8:8080';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>('User');
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [walletId, setWalletId] = useState<string>('');

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(rootAddress+'/users/get', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user');

        const data = await response.json();
        // Adjust this based on actual structure — e.g. data.userName
        setUserName(data.user || 'User');
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch wallet info
  useEffect(() => {
    const fetchWallet = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(rootAddress+'/wallets/get', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch wallet');

        const data = await response.json();
        setWalletAmount(data.wallet.wallet.amount); 
        setWalletId(data.wallet.wallet.wallet_id); 
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };

    fetchWallet();
  }, []);

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(rootAddress+'/twatter/get/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts); // Adjust according to actual response shape
      
    } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome back, {userName}!</h1>
        <p>Here’s a quick look at your activity.</p>
      </header>

        <section className="card">
                <div className="stat-card">
                <h3>Wallets</h3>
                <p>{walletId}</p>

                <h3>Wallet Balance</h3>
                <p>${walletAmount}</p>
            </div>
        </section>

      <section className="card">
        <div className="stat-card">
          <h3>Recent Twatter Posts</h3>
          <div className="twatter-feed">
            {posts.map((post) => (
            <div className="card" key={post.id}>
              <div className="stat-card">
              <h4>{post.header}</h4>
                <p>{post.content}</p>
                <span>by @{post.userName}</span>
                <span className="timestamp">
                {new Date(post.createdAt * 1000).toLocaleString()}
                </span>
              </div>
            </div>
            ))}
        </div>
        </div>
      </section>

      <section className="dashboard-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>✅ Created coin "RealCoin"</li>
          <li>✍️ Posted: "To the moon!"</li>
          <li>🔁 Traded 5 BTC for ETH</li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;