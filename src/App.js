import React, { useState, useEffect } from "react";
import "./App.css";
import HomeScreen from "./components/HomeScreen";
import QuestionScreen from "./components/QuestionScreen";
import { auth } from "./firebase-config";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  function handleSelectTopic(selectedTopic) {
    setTopic(selectedTopic);
  }

  return (
    <div>
      {!topic && <HomeScreen onSelectTopic={handleSelectTopic} isAuthenticated={!!currentUser} />}
      {topic && <QuestionScreen topic={topic} />}
    </div>
  );
}

export default App;
