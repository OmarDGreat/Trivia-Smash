import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { joinQueue } from '../services/queueService'; // Adjust the path as necessary

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

  const handleTopicSelection = async (topic) => {
    if (!isAuthenticated) {
      alert('You need to be logged in to join a queue!');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      await joinQueue(userId, topic);
      onSelectTopic(topic); // Assuming this function handles the logic after selecting a topic
    } catch (error) {
      console.error('Error joining queue:', error);
      alert('Failed to join queue: ' + error.message);
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
            <button onClick={() => handleTopicSelection("geography")}>Geography</button>
            <button onClick={() => handleTopicSelection("math")}>Math</button>
            <button onClick={() => handleTopicSelection("english")}>English</button>
            <button onClick={() => handleTopicSelection("history")}>History</button>
            <button onClick={() => handleTopicSelection("music")}>Music</button>
          </div>
        </>
      )}
    </div>
  );
}

export default HomeScreen;
