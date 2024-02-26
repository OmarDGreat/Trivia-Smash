import { db } from '../firebase-config'; // Adjust the path based on your project structure
import { collection, query, where, getDocs, updateDoc, doc, addDoc} from 'firebase/firestore';

async function matchPlayers() {
    const queueRef = collection(db, 'player_queue');
    const q = query(queueRef, where('isMatched', '==', false));
    const querySnapshot = await getDocs(q);
  
    let playersByTopic = {};
  
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let topic = data.topic;
      if (!playersByTopic[topic]) {
        playersByTopic[topic] = [];
      }
      playersByTopic[topic].push({ id: doc.id, ...data });
    });
  
    Object.keys(playersByTopic).forEach(async (topic) => {
      if (playersByTopic[topic].length >= 2) {
        let matchedPlayers = playersByTopic[topic].slice(0, 2); // Take the first two players for the match
        await createGameSession(matchedPlayers, topic);
      }
    });
  }
  
  async function createGameSession(matchedPlayers, topic) {
    // Create a new game session with initial data
    const sessionRef = collection(db, 'game_sessions');
    const sessionData = {
      players: matchedPlayers.map((player) => player.id),
      scores: { [matchedPlayers[0].id]: 0, [matchedPlayers[1].id]: 0 },
      topic: topic,
      createdAt: new Date(),
      // Additional fields as needed
    };
    await addDoc(sessionRef, sessionData);
  
    // Update the players' isMatched status
    matchedPlayers.forEach(async (player) => {
      const playerRef = doc(db, 'player_queue', player.id);
      await updateDoc(playerRef, { isMatched: true });
    });
  }
  
  export { matchPlayers };