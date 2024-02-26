import React, { useState, useEffect } from "react";
import questionsData from "../Models/questionsData";

function QuestionScreen({ topic }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(10);
  const [score, setScore] = useState(0);
  const [hasScoreUpdated, setHasScoreUpdated] = useState(false);
  const [triggerNextQuestion, setTriggerNextQuestion] = useState(false);
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
      console.log('Timer reached zero, setting trigger for next question...');
      setTriggerNextQuestion(true);
    }
  }, [timer, selectedAnswer]);

  // Handle scoring and setting trigger for the next question
  useEffect(() => {
    if (selectedAnswer && !hasScoreUpdated) {
      if (selectedAnswer === questions[currentQuestionIndex].answer) {
        setScore((prevScore) => prevScore + timer * 100);
      }

      const timeoutId = setTimeout(() => {
        setTriggerNextQuestion(true);
        setHasScoreUpdated(true); // Update the flag here after the timeout
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedAnswer, hasScoreUpdated, currentQuestionIndex, questions, timer]);
  
  // Handle the transition to the next question
  useEffect(() => {
    if (triggerNextQuestion) {
      handleNextQuestion();
    }
  }, [triggerNextQuestion]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(10);
      setSelectedAnswer(null);
      setHasScoreUpdated(false);
      setTriggerNextQuestion(false);  // Resetting the trigger here.
    } else {
      alert(`Quiz finished! Your score: ${score}`);
    }
  };

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
