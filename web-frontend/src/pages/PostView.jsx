import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, deletePost } from '../store/slices/postsSlice';

export default function PostView(){
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector(state => state.posts.current);
  const auth = useSelector(state => state.auth);
  const nav = useNavigate();

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (confirm('Delete post?')) {
      await dispatch(deletePost(id)).unwrap();
      nav('/');
    }
  };

  if (!post) return <div>Loading...</div>;

  const isAuthor = auth.user && auth.user.id === post.author?._id;

  return (
    <div>
      <h1>{post.title}</h1>
      <p className="meta">by <Link to={`/profile/${post.author._id}`}>{post.author.name}</Link> • {new Date(post.createdAt).toLocaleString()}</p>
      {post.lastEditedBy && (
        <p className="meta">last edited by <Link to={`/profile/${post.lastEditedBy._id}`}>{post.lastEditedBy.name}</Link></p>
      )}
      <div className="content">{post.content}</div>
      {isAuthor && (
        <div className="actions">
          <Link to={`/edit/${post._id}`}>Edit</Link>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}


