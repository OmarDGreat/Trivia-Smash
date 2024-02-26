import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

function HomeScreen({ onSelectTopic, isAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully');
    } catch (error) {
      console.error('Registration error', error);
      alert(error.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Login error', error);
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      {!isAuthenticated ? (
        <>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" autocomplete="email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autocomplete="current-password" />
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </>
      ) : (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <div>
            <button onClick={() => onSelectTopic("geography")}>Geography</button>
            <button onClick={() => onSelectTopic("math")}>Math</button>
            <button onClick={() => onSelectTopic("english")}>English</button>
            <button onClick={() => onSelectTopic("history")}>History</button>
            <button onClick={() => onSelectTopic("music")}>Music</button>
          </div>
        </>
      )}
    </div>
  );
}

export default HomeScreen;