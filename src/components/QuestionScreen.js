import React, { useState, useEffect } from "react";
import questionsData from "../Models/questionsData";

function QuestionScreen({ topic }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(10);
  const [score, setScore] = useState(0);
  const [hasScoreUpdated, setHasScoreUpdated] = useState(false);
  const [triggerNextQuestion, setTriggerNextQuestion] = useState(false);
  const [showRound, setShowRound] = useState(true);
  const questions = questionsData[topic];

  // Timer countdown logic
  useEffect(() => {
    if (timer > 0 && !selectedAnswer) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }

    if (timer === 0) {
      setTriggerNextQuestion(true);
    }
  }, [timer, selectedAnswer]);

  // Show round information for 2 seconds before showing the question
  useEffect(() => {
    if (showRound) {
      const timer = setTimeout(() => {
        setShowRound(false);
        setTimer(10);
      }, 2000); // Show round info for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [showRound, currentQuestionIndex]);

  // Handle scoring and setting trigger for the next question
  useEffect(() => {
    if (selectedAnswer && !hasScoreUpdated) {
      if (selectedAnswer === questions[currentQuestionIndex].answer) {
        setScore((prevScore) => prevScore + timer * 100);
      }

      const timeoutId = setTimeout(() => {
        setTriggerNextQuestion(true);
        setHasScoreUpdated(true);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedAnswer, hasScoreUpdated, currentQuestionIndex, questions, timer]);

  // Handle the transition to the next question
  useEffect(() => {
    if (triggerNextQuestion && !showRound) {
      handleNextQuestion();
    }
  }, [triggerNextQuestion, showRound]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setShowRound(true);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(10);
      setSelectedAnswer(null);
      setHasScoreUpdated(false);
      setTriggerNextQuestion(false);
    } else {
      alert(`Quiz finished! Your score: ${score}`);
    }
  };

  return (
    <div>
      {showRound ? (
        <div>Round {currentQuestionIndex + 1}</div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default QuestionScreen;
