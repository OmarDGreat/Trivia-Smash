import { db } from "../firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";

async function matchPlayers() {
  const queueRef = collection(db, "queue");
  const q = query(queueRef, where("isMatched", "==", false));
  let querySnapshot;
  try {
    querySnapshot = await getDocs(q);
  } catch (error) {
    console.error("Error fetching players from queue:", error);
    return;
  }

  let playersByTopic = {};

  querySnapshot.forEach((doc) => {
    let data = doc.data();
    let topic = data.topic;
    if (!playersByTopic[topic]) {
      playersByTopic[topic] = [];
    }
    playersByTopic[topic].push({
      queueId: doc.id,
      userId: data.userId,
      ...data,
    });
  });

  for (const topic of Object.keys(playersByTopic)) {
    while (playersByTopic[topic].length >= 2) {
      let matchedPlayers = playersByTopic[topic].splice(0, 2);
      try {
        await createGameSession(matchedPlayers, topic);
      } catch (error) {
        console.error(`Error creating game session for topic ${topic}:`, error);
      }
    }
  }
}

async function createGameSession(matchedPlayers, topic) {
  const sessionRef = collection(db, "game_sessions");
  const sessionData = {
    players: matchedPlayers.reduce(
      (acc, player) => ({
        ...acc,
        [player.userId]: { score: 0, answered: false },
      }),
      {}
    ),
    topic: topic,
    createdAt: new Date(),
    timer: 10, // Initialize the timer to 10 seconds for the question countdown
  };

  let docRef;
  try {
    docRef = await addDoc(sessionRef, sessionData);
  } catch (error) {
    console.error("Error creating a new game session:", error);
    return;
  }

  for (const player of matchedPlayers) {
    const playerRef = doc(db, "queue", player.queueId);
    try {
      await updateDoc(playerRef, { isMatched: true, gameSessionId: docRef.id });
    } catch (error) {
      console.error(`Error updating player ${player.userId} status:`, error);
    }
  }
}

export { matchPlayers };
