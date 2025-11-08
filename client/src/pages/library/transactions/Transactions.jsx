import { useState, useEffect } from "react";
import {
  getTransactions,
  getBooks,
  getMembers,
  issueBook,
  returnBook,
} from "../../../services/api";
import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [issueFormData, setIssueFormData] = useState({
    book_id: "",
    member_id: "",
  });
  const [returnFormData, setReturnFormData] = useState({
    rent_fee: 0,
  });
  const [filter, setFilter] = useState("all"); // all, active, returned

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionsData, booksData, membersData] = await Promise.all([
        getTransactions(),
        getBooks(),
        getMembers(),
      ]);

      setTransactions(
        Array.isArray(transactionsData)
          ? transactionsData
          : transactionsData.results || []
      );
      setBooks(Array.isArray(booksData) ? booksData : booksData.results || []);
      setMembers(
        Array.isArray(membersData) ? membersData : membersData.results || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "active") return transaction.is_active;
    if (filter === "returned") return !transaction.is_active;
    return true;
  });

  const handleOpenIssueModal = () => {
    setIssueFormData({
      book_id: "",
      member_id: "",
    });
    setShowIssueModal(true);
  };

  const handleCloseIssueModal = () => {
    setShowIssueModal(false);
    setError("");
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await issueBook(
        parseInt(issueFormData.book_id),
        parseInt(issueFormData.member_id)
      );
      handleCloseIssueModal();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenReturnModal = (transaction) => {
    setSelectedTransaction(transaction);
    setReturnFormData({
      rent_fee: 0,
    });
    setShowReturnModal(true);
  };

  const handleCloseReturnModal = () => {
    setShowReturnModal(false);
    setSelectedTransaction(null);
    setError("");
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await returnBook(
        selectedTransaction.id,
        parseFloat(returnFormData.rent_fee) || 0
      );
      handleCloseReturnModal();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="transactions-container">
      <div className="page-header">
        <h1>Transactions</h1>
        <button className="btn btn-primary" onClick={handleOpenIssueModal}>
          Issue Book
        </button>
      </div>

      <div className="filter-section">
        <button
          className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn ${
            filter === "active" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`btn ${
            filter === "returned" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setFilter("returned")}
        >
          Returned
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Book</th>
                <th>Member</th>
                <th>Rent Fee (Rs.)</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <span
                        className={`badge ${
                          transaction.transaction_type === "issue"
                            ? "badge-issue"
                            : "badge-return"
                        }`}
                      >
                        {transaction.transaction_type.toUpperCase()}
                      </span>
                    </td>
                    <td>{transaction.book_title || transaction.book}</td>
                    <td>
                      {transaction.member_name || transaction.member}
                      <br />
                      <small>{transaction.member_email}</small>
                    </td>
                    <td>₹{parseFloat(transaction.rent_fee || 0).toFixed(2)}</td>
                    <td>{formatDate(transaction.issue_date)}</td>
                    <td>{formatDate(transaction.return_date)}</td>
                    <td>
                      <span
                        className={`badge ${
                          transaction.is_active
                            ? "badge-active"
                            : "badge-returned"
                        }`}
                      >
                        {transaction.is_active ? "Active" : "Returned"}
                      </span>
                    </td>
                    <td>
                      {transaction.is_active && (
                        <button
                          className="btn btn-sm btn-return"
                          onClick={() => handleOpenReturnModal(transaction)}
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showIssueModal && (
        <div className="modal-overlay" onClick={handleCloseIssueModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Issue Book</h2>
            <form onSubmit={handleIssueSubmit}>
              <div className="form-group">
                <label>Book *</label>
                <select
                  value={issueFormData.book_id}
                  onChange={(e) =>
                    setIssueFormData({
                      ...issueFormData,
                      book_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select a book</option>
                  {books
                    .filter((book) => book.stock > 0)
                    .map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} (Stock: {book.stock})
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label>Member *</label>
                <select
                  value={issueFormData.member_id}
                  onChange={(e) =>
                    setIssueFormData({
                      ...issueFormData,
                      member_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select a member</option>
                  {members
                    .filter(
                      (member) => parseFloat(member.outstanding_debt) < 500
                    )
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} (Debt: ₹
                        {parseFloat(member.outstanding_debt).toFixed(2)})
                      </option>
                    ))}
                </select>
                {members.filter((m) => parseFloat(m.outstanding_debt) < 500)
                  .length === 0 && (
                  <small className="warning-text">
                    No members available (all members have debt ≥ Rs. 500)
                  </small>
                )}
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Issue Book
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseIssueModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReturnModal && selectedTransaction && (
        <div className="modal-overlay" onClick={handleCloseReturnModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Return Book</h2>
            <div className="return-info">
              <p>
                <strong>Book:</strong>{" "}
                {selectedTransaction.book_title || selectedTransaction.book}
              </p>
              <p>
                <strong>Member:</strong>{" "}
                {selectedTransaction.member_name || selectedTransaction.member}
              </p>
              <p>
                <strong>Issue Date:</strong>{" "}
                {formatDate(selectedTransaction.issue_date)}
              </p>
            </div>
            <form onSubmit={handleReturnSubmit}>
              <div className="form-group">
                <label>Rent Fee (Rs.) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={returnFormData.rent_fee}
                  onChange={(e) =>
                    setReturnFormData({
                      ...returnFormData,
                      rent_fee: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Return Book
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseReturnModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
