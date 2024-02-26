import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXgEU6Eh2LAaJgTkEudgNPcOySmJPsS-w",
  authDomain: "trivia-smash.firebaseapp.com",
  projectId: "trivia-smash",
  storageBucket: "trivia-smash.appspot.com",
  messagingSenderId: "1006261280011",
  appId: "1:1006261280011:web:a707a83929db8b8762160e",
  measurementId: "G-QEGCSFRS9X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
