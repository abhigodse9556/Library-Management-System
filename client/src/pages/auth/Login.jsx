import { useState } from "react";
import "./Login.css";
import { login } from "../../services/loginApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = {
      userName: username,
      password: password,
    };
    try {
      const response = await login(payload);
      console.log("Login successful", response);
      if (response.status === "success") {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("tokens", JSON.stringify(response.tokens));
        navigate("/library");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      setError("Login failed. Please check credentials.");
    }
  };
  return (
    <div className="login-container">
      <div className="login-content">
        <h3 className="login-title">Welcome to Library Management System</h3>
        <p className={error ? "login-subtitle-error" : "login-subtitle"}>
          {error ? error : "Login to continue"}
        </p>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="login-button"
            type="submit"
            onClick={(e) => {
              handleLogin(e);
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
