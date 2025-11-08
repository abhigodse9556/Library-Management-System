import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Books from "./components/Books";
import Members from "./components/Members";
import Transactions from "./components/Transactions";
import ImportBooks from "./components/ImportBooks";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
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
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/import" element={<ImportBooks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
