import React, { useState } from "react";
import "./App.css";
import HomeScreen from "./components/HomeScreen";
import QuestionScreen from "./components/QuestionScreen";

function App() {
  const [topic, setTopic] = useState(null);

  function handleSelectTopic(selectedTopic) {
    setTopic(selectedTopic);
  }
  return (
    <div>
      {!topic && <HomeScreen onSelectTopic={handleSelectTopic} />}
      {topic && <QuestionScreen topic={topic} />}
      {/* Conditionally render other components based on the state */}
    </div>
  );
}

export default App;
