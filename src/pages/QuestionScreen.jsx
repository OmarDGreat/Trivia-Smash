import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { listenToSession, updateScore } from "../services/gameService";
import QuestionDisplay from "../components/QuestionScreen/QuestionDisplay"; // Adjust the path as necessary
import ScoreDisplay from "../components/QuestionScreen/ScoreDisplay"; // Adjust the path as necessary

function QuestionScreen({ sessionID, userID }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState("");
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (!sessionID) return;

    const unsubscribe = listenToSession(sessionID, userID, {
      onSessionUpdate: (data) => {
        setCurrentQuestionIndex(data.currentQuestionIndex);
        setQuestions(data.questions);
        setPlayerScore(data.playerScore);
        setOpponentScore(data.opponentScore);
        setOpponentName(data.opponentName);
        setGameEnded(data.gameEnded);
      },
    });

    return () => unsubscribe();
  }, [sessionID, userID]);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return; // Prevent multiple answers
    setSelectedAnswer(answer);
    updateScore(sessionID, userID, answer, questions[currentQuestionIndex]?.answer);
  };

  return (
    <div>
      {gameEnded ? (
        <div>Game Over. Your final score is: {playerScore}</div>
      ) : (
        <>
          {questions.length > 0 && (
            <QuestionDisplay
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
            />
          )}
          <ScoreDisplay
            playerScore={playerScore}
            opponentScore={opponentScore}
            opponentName={opponentName}
          />
        </>
      )}
    </div>
  );
}

QuestionScreen.propTypes = {
  sessionID: PropTypes.string, // sessionID might be optional based on your app's logic
  userID: PropTypes.string.isRequired,
};

export default QuestionScreen;
