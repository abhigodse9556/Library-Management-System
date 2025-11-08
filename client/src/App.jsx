import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import Books from "./pages/library/books/Books";
import Members from "./pages/library/members/Members";
import Transactions from "./pages/library/transactions/Transactions";
import ImportBooks from "./pages/library/books/ImportBooks";
import Library from "./pages/library/Library";

function App() {
  return (
    <Router>
      <main className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/library" element={<Library />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/import" element={<ImportBooks />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
