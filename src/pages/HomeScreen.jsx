import PropTypes from 'prop-types';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { joinQueue } from "../services/queueService";
import AuthForm from "../components/AuthForm"; // Adjust the path as necessary
import TopicSelector from "../components/TopicSelector"; // Adjust the path as necessary

function HomeScreen({ onSelectTopic, isAuthenticated }) {
  const auth = getAuth();

  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully");
    } catch (error) {
      console.error("Registration error", error);
      alert(error.message);
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
    } catch (error) {
      console.error("Login error", error);
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Sign out error", error);
      alert(error.message);
    }
  };

  const handleTopicSelection = async (topic) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to join a queue!");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      await joinQueue(userId, topic);
      onSelectTopic(topic);
    } catch (error) {
      console.error("Error joining queue:", error);
      alert("Failed to join queue: " + error.message);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      {!isAuthenticated ? (
        <AuthForm onRegister={register} onLogin={login} />
      ) : (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <TopicSelector onSelectTopic={handleTopicSelection} />
        </>
      )}
    </div>
  );
}

HomeScreen.propTypes = {
  onSelectTopic: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default HomeScreen;
