import React from "react";
import "./Library.css";
import { Link } from "react-router-dom";
const Library = () => {
  return (
    <div className="library-container">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">Library Management System</h1>
          <div className="nav-links">
            <Link to="/books" className="nav-link">
              Books
            </Link>
            <Link to="/members" className="nav-link">
              Members
            </Link>
            <Link to="/transactions" className="nav-link">
              Transactions
            </Link>
            <Link to="/import" className="nav-link">
              Import Books
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Library;
