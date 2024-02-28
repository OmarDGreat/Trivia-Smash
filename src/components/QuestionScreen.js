import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import questionsData from "../Models/questionsData";

function QuestionScreen({ sessionID, userID }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(10); // Initial timer value will be updated from Firestore
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!sessionID) {
      console.error("sessionID is undefined");
      return;
    }

    const sessionRef = doc(db, "game_sessions", sessionID);

    const unsub = onSnapshot(sessionRef, (doc) => {
      const data = doc.data();

      if (!data) {
        console.error("Document is undefined or does not exist.");
        return;
      }

      if (data.timer !== undefined) {
        setTimer(data.timer); // Update the timer from Firestore
      }

      if (!data.players || !data.players[userID]) {
        console.error("Invalid data structure received from Firestore", data);
        return;
      }

      setPlayerScore(data.players[userID].score || 0);
      setQuestions(questionsData[data.topic] || []);

      const opponentID = Object.keys(data.players).find((id) => id !== userID);
      if (opponentID) {
        setOpponentScore(data.players[opponentID].score || 0);
        setOpponentName(data.players[opponentID].name || "Unknown");
      }

      setCurrentQuestionIndex(
        data.currentQuestionIndex >= 0 ? data.currentQuestionIndex : 0
      );
    });

    return () => unsub();
  }, [sessionID, userID]);

  useEffect(() => {
    if (timer === 0 || selectedAnswer) {
      handleAnswer();
    }
  }, [timer, selectedAnswer]);

  const handleAnswer = async () => {
    if (!sessionID) {
      console.error("sessionID is undefined");
      return;
    }

    const sessionRef = doc(db, "game_sessions", sessionID);

    let newScore = playerScore;
    if (
      selectedAnswer &&
      questions[currentQuestionIndex] &&
      selectedAnswer === questions[currentQuestionIndex].correctAnswer
    ) {
      newScore += 10; // Increment score, for example
    }

    await updateDoc(sessionRef, {
      [`players.${userID}.score`]: newScore,
      [`players.${userID}.answered`]: true,
    });

    setSelectedAnswer(null);
    // Do not reset the timer here; it should only be controlled by the backend
  };

  return (
    <div>
      <h2>
        {questions[currentQuestionIndex]?.title || "Waiting for question..."}
      </h2>
      <div>{timer} seconds left</div>
      <div>
        {questions.length > 0 &&
          questions[currentQuestionIndex]?.choices.map((choice, index) => (
            <button key={index} onClick={() => setSelectedAnswer(choice)}>
              {choice}
            </button>
          ))}
      </div>
      <div>Your score: {playerScore}</div>
      <div>
        Opponent ({opponentName}) score: {opponentScore}
      </div>
    </div>
  );
}

export default QuestionScreen;
