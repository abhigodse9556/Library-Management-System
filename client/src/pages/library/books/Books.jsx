import { useState, useEffect } from "react";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} from "../../../services/bookApi";
import "./Books.css";
import Navbar from "../../../components/Navbar";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    isbn: "",
    isbn13: "",
    publisher: "",
    publication_date: "",
    language_code: "",
    num_pages: "",
    stock: 1,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBooks();
      console.log("Fetched books data:", data);
      setBooks(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await searchBooks(searchTitle, searchAuthor);
      setBooks(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTitle("");
    setSearchAuthor("");
    fetchBooks();
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title || "",
        authors: book.authors || "",
        isbn: book.isbn || "",
        isbn13: book.isbn13 || "",
        publisher: book.publisher || "",
        publication_date: book.publication_date || "",
        language_code: book.language_code || "",
        num_pages: book.num_pages || "",
        stock: book.stock || 1,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        authors: "",
        isbn: "",
        isbn13: "",
        publisher: "",
        publication_date: "",
        language_code: "",
        num_pages: "",
        stock: 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const bookData = {
        ...formData,
        num_pages: formData.num_pages ? parseInt(formData.num_pages) : null,
        stock: parseInt(formData.stock),
      };

      if (editingBook) {
        await updateBook(editingBook.id, bookData);
      } else {
        await createBook(bookData);
      }
      handleCloseModal();
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="books-container">
        <div className="page-header">
          <h1>Books Management</h1>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Add New Book
          </button>
        </div>

        <div className="search-section">
          <div className="search-inputs">
            <input
              type="text"
              placeholder="Search by title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by author"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-outline" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading books...</div>
        ) : (
          <div className="books-table-container">
            <table className="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>ISBN</th>
                  <th>Publisher</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No books found
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.authors}</td>
                      <td>{book.isbn || "-"}</td>
                      <td>{book.publisher || "-"}</td>
                      <td>{book.stock}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleOpenModal(book)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Authors *</label>
                  <input
                    type="text"
                    value={formData.authors}
                    onChange={(e) =>
                      setFormData({ ...formData, authors: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ISBN</label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={(e) =>
                        setFormData({ ...formData, isbn: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>ISBN13</label>
                    <input
                      type="text"
                      value={formData.isbn13}
                      onChange={(e) =>
                        setFormData({ ...formData, isbn13: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Publication Date</label>
                    <input
                      type="text"
                      value={formData.publication_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publication_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Pages</label>
                    <input
                      type="number"
                      value={formData.num_pages}
                      onChange={(e) =>
                        setFormData({ ...formData, num_pages: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Language</label>
                    <input
                      type="text"
                      value={formData.language_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          language_code: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingBook ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Books;
