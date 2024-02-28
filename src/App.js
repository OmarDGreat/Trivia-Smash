import React, { useState, useEffect } from "react";
import "./App.css";
import HomeScreen from "./components/HomeScreen";
import QuestionScreen from "./components/QuestionScreen";
import { auth, db } from "./firebase-config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [topic, setTopic] = useState(null);
  const [sessionID, setSessionID] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !topic) return;

    // Start listening for session updates when a topic is selected and the user is authenticated
    const q = query(collection(db, "queue"), where("userId", "==", currentUser.uid), where("isMatched", "==", true));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.gameSessionId) {
          // Update sessionID when a match is found and a session is created
          setSessionID(data.gameSessionId);
        }
      });
    });

    return () => unsubscribe(); // Clean up the listener
  }, [currentUser, topic]);

  function handleSelectTopic(selectedTopic) {
    setTopic(selectedTopic);
    // Initiate the matchmaking process here if necessary
  }

  return (
    <div>
      {!topic && <HomeScreen onSelectTopic={handleSelectTopic} isAuthenticated={!!currentUser} />}
      {topic && sessionID && <QuestionScreen topic={topic} sessionID={sessionID} userID={currentUser?.uid} />}
    </div>
  );
}

export default App;
