// queueService.js

import { db } from './firebase-config';
import { collection, addDoc } from "firebase/firestore"; 

const joinQueue = async (userId, topic) => {
  try {
    const docRef = await addDoc(collection(db, "queue"), {
      userId: userId,
      topic: topic,
      joinedAt: new Date() // Timestamp to identify when the user joined the queue
    });
    console.log("Player added to the queue with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding player to queue: ", e);
  }
};

export { joinQueue };
