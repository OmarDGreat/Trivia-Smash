import { useState } from "react";
import PropTypes from "prop-types";

function AuthForm({ onRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
      />
      <button onClick={() => onRegister(email, password)}>Register</button>
      <button onClick={() => onLogin(email, password)}>Login</button>
    </>
  );
}

AuthForm.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default AuthForm;
