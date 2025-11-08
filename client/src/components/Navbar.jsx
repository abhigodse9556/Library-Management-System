import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1
          className="nav-title"
          onClick={() => navigate("/library", { replace: true })}
          style={{ cursor: "pointer" }}
        >
          Library Management System
        </h1>
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
          <Link to="/users" className="nav-link">
            Users
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
