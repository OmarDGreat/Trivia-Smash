import React from "react";

function HomeScreen({ onSelectTopic }) {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => onSelectTopic("geography")}>Geography</button>
      <button onClick={() => onSelectTopic("math")}>Math</button>
      <button onClick={() => onSelectTopic("english")}>English</button>
      <button onClick={() => onSelectTopic("history")}>History</button>
      <button onClick={() => onSelectTopic("music")}>Music</button>
    </div>
  );
}

export default HomeScreen;
