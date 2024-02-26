import React, { useState, useEffect } from "react";
import questionsData from "../Models/questionsData"; // Adjust the path based on your file structure

function QuestionScreen({ topic }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(10); // Adjust time as needed
  const [score, setScore] = useState(0);
  const questions = questionsData[topic];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Move to the next question or handle end of quiz when time runs out
      handleNextQuestion();
    }
  }, [timer]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(10); // Reset timer for the next question
    } else {
      // Handle end of quiz, such as showing results or resetting the quiz
      alert(`Quiz finished! Your score: ${score}`);
    }
    setSelectedAnswer(null);
  };

  useEffect(() => {
    if (selectedAnswer) {
      if (selectedAnswer === questions[currentQuestionIndex].answer) {
        setScore(score + timer * 100); // Update score based on remaining time
      }
      setTimeout(handleNextQuestion, 1000); // Move to the next question after a delay
    }
  }, [selectedAnswer, currentQuestionIndex, questions, score, timer]);

  return (
    <div>
      <h2>{questions[currentQuestionIndex].title}</h2>
      <div>{timer} seconds left</div>
      <div>
        {questions[currentQuestionIndex].choices.map((choice, index) => (
          <button key={index} onClick={() => setSelectedAnswer(choice)}>
            {choice}
          </button>
        ))}
      </div>
      <div>Your score: {score}</div>
    </div>
  );
}

export default QuestionScreen;
