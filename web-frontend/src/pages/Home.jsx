import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/slices/postsSlice';
import { Link } from 'react-router-dom';

export default function Home(){
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.list);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div>
      <h1>Latest Posts</h1>
      <div className="posts-grid">
        {posts.map(p => (
          <div className="post-card" key={p._id}>
            <Link to={`/post/${p._id}`}>
              <h3>{p.title}</h3>
              <p className="meta">by {p.author?.name} • {new Date(p.createdAt).toLocaleString()}</p>
              {p.lastEditedBy && (
                <p className="meta">last edited by {p.lastEditedBy.name}</p>
              )}
              <p className="excerpt">{p.content.slice(0, 150)}...</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


