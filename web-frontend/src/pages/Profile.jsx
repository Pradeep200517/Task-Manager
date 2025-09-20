import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Profile(){
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/users/${id}`);
      setUser(res.data.user);
      setPosts(res.data.posts);
    }
    load();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="profile-header">
        <img src={user.avatar || 'https://via.placeholder.com/80'} alt="avatar" />
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>

      <h3>Posts by {user.name}</h3>
      <div className="posts-grid">
        {posts.map(p => (
          <div key={p._id} className="post-card">
            <Link to={`/post/${p._id}`}>
              <h4>{p.title}</h4>
              <p className="excerpt">{p.content.slice(0, 120)}...</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


