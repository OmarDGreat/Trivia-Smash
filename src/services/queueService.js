// queueService.js

import { db } from '../firebase-config';
import { collection, addDoc } from "firebase/firestore";
import { matchPlayers } from './matchMakingService'; // Adjust the path if necessary

const joinQueue = async (userId, topic) => {
  try {
    const docRef = await addDoc(collection(db, "queue"), {
      userId: userId,
      topic: topic,
      isMatched: false, // Ensure you have an 'isMatched' flag to track the player's match status
      joinedAt: new Date() // Timestamp to identify when the user joined the queue
    });
    console.log("Player added to the queue with ID: ", docRef.id);

    // After adding a player to the queue, trigger the matchmaking process
    await matchPlayers();
  } catch (e) {
    console.error("Error adding player to queue: ", e);
  }
};

export { joinQueue };
