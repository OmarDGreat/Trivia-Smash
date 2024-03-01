import { useState, useEffect } from "react";
import "./App.css";
import HomeScreen from "./pages/HomeScreen";
import QuestionScreen from "./pages/QuestionScreen";
import { auth, db } from "./firebase-config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

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

    const q = query(
      collection(db, "queue"),
      where("userId", "==", currentUser.uid),
      where("isMatched", "==", true)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.gameSessionId) {
          setSessionID(data.gameSessionId);
        }
      });
    });

    return () => unsubscribe();
  }, [currentUser, topic]);

  function handleSelectTopic(selectedTopic) {
    setTopic(selectedTopic);
  }

  return (
    <div>
      {!topic && (
        <HomeScreen
          onSelectTopic={handleSelectTopic}
          isAuthenticated={!!currentUser}
        />
      )}
      {topic && sessionID && (
        <QuestionScreen
          topic={topic}
          sessionID={sessionID}
          userID={currentUser?.uid}
        />
      )}
    </div>
  );
}

export default App;
