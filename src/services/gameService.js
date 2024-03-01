import { db } from "../firebase-config";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";

/**
 * Listens to updates on a specific game session.
 * 
 * @param {string} sessionID The ID of the session to listen to.
 * @param {string} userID The ID of the current user.
 * @param {object} callbacks An object containing callback functions.
 */
const listenToSession = (sessionID, userID, callbacks) => {
  const sessionRef = doc(db, "game_sessions", sessionID);

  const unsubscribe = onSnapshot(sessionRef, (doc) => {
    const data = doc.data();
    if (!data) return;

    // Extracting necessary data from session
    const playerScore = data.players[userID]?.score || 0;
    const opponentID = Object.keys(data.players).find((id) => id !== userID);
    const opponentScore = data.players[opponentID]?.score || 0;
    const opponentName = data.players[opponentID]?.name || "Unknown";

    // Using callbacks to update state in the component
    if (callbacks.onSessionUpdate) {
      callbacks.onSessionUpdate({
        currentQuestionIndex: data.currentQuestionIndex,
        questions: data.questions,
        playerScore: playerScore,
        opponentScore: opponentScore,
        opponentName: opponentName,
        gameEnded: data.gameEnded,
      });
    }
  });

  return unsubscribe;
};

/**
 * Updates the score for a user in a game session.
 * 
 * @param {string} sessionID The ID of the game session.
 * @param {string} userID The ID of the user whose score is to be updated.
 * @param {string} answer The answer provided by the user.
 * @param {string} correctAnswer The correct answer to the question.
 */
const updateScore = async (sessionID, userID, answer, correctAnswer) => {
  const sessionRef = doc(db, "game_sessions", sessionID);
  const newScoreUpdate = {};

  // Check if the answer is correct and update the score accordingly
  if (answer === correctAnswer) {
    const sessionSnapshot = await getDoc(sessionRef);
    const sessionData = sessionSnapshot.data();
    const currentScore = sessionData.players[userID]?.score || 0;
    newScoreUpdate[`players.${userID}.score`] = currentScore + 10; // Assuming each correct answer adds 10 points
  }

  // Mark the user as having answered the current question
  newScoreUpdate[`players.${userID}.answered`] = true;

  await updateDoc(sessionRef, newScoreUpdate);
};

export { listenToSession, updateScore };
