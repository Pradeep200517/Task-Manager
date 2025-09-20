import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      await dispatch(register({ name, email, password })).unwrap();
      nav('/');
    }catch(err){
      alert(err?.message || 'Register failed');
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Register</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
}


