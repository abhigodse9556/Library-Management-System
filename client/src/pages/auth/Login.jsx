import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = "/library";
  };
  return (
    <div className="login-container">
      <div className="login-content">
        <h3 className="login-title">Welcome to Library Management System</h3>
        <p className="login-subtitle">Please log in to continue</p>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
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
