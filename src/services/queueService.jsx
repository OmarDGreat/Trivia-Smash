import { db } from '../firebase-config';
import { collection, addDoc } from "firebase/firestore";
import { matchPlayers } from './matchMakingService';

const joinQueue = async (userId, topic) => {
  try {
    const docRef = await addDoc(collection(db, "queue"), {
      userId: userId,
      topic: topic,
      isMatched: false,
      joinedAt: new Date()
    });
    console.log("Player added to the queue with ID: ", docRef.id);

    await matchPlayers();
  } catch (e) {
    console.error("Error adding player to queue: ", e);
  }
};

export { joinQueue };
