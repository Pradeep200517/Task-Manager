import React, { useEffect, useState } from 'react';
import { createPost, fetchPostById, updatePost } from '../store/slices/postsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateEdit({ edit }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector(state => state.posts.current);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (edit && id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, edit, id]);

  useEffect(() => {
    if (post && edit) {
      setTitle(post.title);
      setContent(post.content);
      setTags((post.tags || []).join(','));
      setImage(post.image || '');
    }
  }, [post, edit]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { title, content, tags: tags.split(',').map(t => t.trim()).filter(Boolean), image };
    try {
      if (edit) {
        await dispatch(updatePost({ id, data: payload })).unwrap();
      } else {
        await dispatch(createPost(payload)).unwrap();
      }
      nav('/');
    } catch (err) {
      alert('Error saving post');
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>{edit ? 'Edit Post' : 'Create Post'}</h2>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
      <input value={image} onChange={e=>setImage(e.target.value)} placeholder="Image URL (optional)" />
      <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="tags (comma separated)" />
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" rows="10" required />
      <button type="submit">Save</button>
    </form>
  );
}


