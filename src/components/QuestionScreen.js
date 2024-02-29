import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import questionsData from "../Models/questionsData";

function QuestionScreen({ sessionID, userID }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(10);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState("");
  const [questions, setQuestions] = useState(questionsData["geography"]); 
  const [gameEnded, setGameEnded] = useState(false);
  const [showRound, setShowRound] = useState(true);

  const sessionRef = sessionID ? doc(db, "game_sessions", sessionID) : null;

  useEffect(() => {
    if (!sessionRef) return;

    const unsub = onSnapshot(sessionRef, (doc) => {
      const data = doc.data();
      if (!data) return;

      setPlayerScore(data.players[userID]?.score || 0);
      setQuestions(questionsData[data.topic] || []);
      setCurrentQuestionIndex(data.currentQuestionIndex || 0);
      setGameEnded(data.gameEnded || false);

      const opponentID = Object.keys(data.players).find(id => id !== userID);
      if (opponentID) {
        setOpponentScore(data.players[opponentID]?.score || 0);
        setOpponentName(data.players[opponentID]?.name || "Unknown");
      }

      if (data.players[userID]?.answered && data.players[opponentID]?.answered) {
        setShowRound(true); // Show round transition
        setSelectedAnswer(null); // Reset answer for the next question
      }
    });

    return () => unsub();
  }, [sessionRef, userID]);

  useEffect(() => {
    let interval = null;
    if (showRound) {
      setTimeout(() => setShowRound(false), 2000); // Show round for 2 seconds
    } else if (timer > 0 && !gameEnded) {
      interval = setInterval(() => setTimer(prevTimer => prevTimer - 1), 1000);
    } else if (timer === 0 && !gameEnded) {
      setTimer(10); // Reset timer for next question or round transition
    }
    return () => clearInterval(interval);
  }, [timer, gameEnded, showRound]);

  const handleAnswer = async (answer) => {
    if (selectedAnswer || !sessionRef) return;

    setSelectedAnswer(answer);
    const correctAnswer = questions[currentQuestionIndex]?.correctAnswer;
    let newScore = playerScore + (answer === correctAnswer ? 10 : 0);

    await updateDoc(sessionRef, {
      [`players.${userID}.score`]: newScore,
      [`players.${userID}.answered`]: true,
    });

    const sessionSnapshot = await getDoc(sessionRef);
    const sessionData = sessionSnapshot.data();
    const opponentID = Object.keys(sessionData.players).find(id => id !== userID);

    if (sessionData.players[userID].answered && sessionData.players[opponentID].answered) {
      if (currentQuestionIndex < questions.length - 1) {
        await updateDoc(sessionRef, {
          currentQuestionIndex: currentQuestionIndex + 1,
          [`players.${userID}.answered`]: false,
          [`players.${opponentID}.answered`]: false,
        });
        setTimer(10); // Reset timer for the next question
      } else {
        await updateDoc(sessionRef, { gameEnded: true });
      }
    }
  };

  if (gameEnded) {
    return <div>Game Over. Your final score is: {playerScore}</div>;
  }

  return (
    <div>
      {showRound ? (
        <div>Round {currentQuestionIndex + 1}</div>
      ) : (
        <>
          <h2>{questions[currentQuestionIndex]?.title || "Waiting for question..."}</h2>
          <div>{timer} seconds left</div>
          <div>
            {questions[currentQuestionIndex]?.choices.map((choice, index) => (
              <button key={index} onClick={() => handleAnswer(choice)} disabled={!!selectedAnswer}>
                {choice}
              </button>
            ))}
          </div>
          <div>Your score: {playerScore}</div>
          <div>Opponent ({opponentName}) score: {opponentScore}</div>
        </>
      )}
    </div>
  );
}

export default QuestionScreen;
