import { useState } from "react";
import { importBooks } from "../../../services/bookApi";
import "./ImportBooks.css";
import Navbar from "../../../components/Navbar";

const ImportBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importedBooks, setImportedBooks] = useState([]);
  const [formData, setFormData] = useState({
    count: 20,
    title: "",
    authors: "",
    isbn: "",
    publisher: "",
    page: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setImportedBooks([]);

      const params = {
        count: formData.count.toString(),
        page: formData.page.toString(),
      };

      if (formData.title) params.title = formData.title;
      if (formData.authors) params.authors = formData.authors;
      if (formData.isbn) params.isbn = formData.isbn;
      if (formData.publisher) params.publisher = formData.publisher;

      const result = await importBooks(params);
      setImportedBooks(result.books || []);
      setSuccess(
        `Successfully imported ${
          result.count || result.books?.length || 0
        } book(s)`
      );
      setFormData({
        ...formData,
        title: "",
        authors: "",
        isbn: "",
        publisher: "",
        page: 1,
      });
    } catch (err) {
      setError(err.message);
      setImportedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="import-books-container">
        <div className="page-header">
          <h1>Import Books from Frappe Library API</h1>
        </div>

        <div className="import-info">
          <p>
            Import books from the Frappe Library API. The API returns a maximum
            of 20 books per page. You can specify search parameters to filter
            the results.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="import-form">
          <div className="form-group">
            <label>Number of Books to Import *</label>
            <input
              type="number"
              min="1"
              max="200"
              value={formData.count}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  count: parseInt(e.target.value) || 20,
                })
              }
              required
            />
            <small>
              Maximum 20 books per page. API will fetch multiple pages if
              needed.
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Harry Potter"
              />
            </div>
            <div className="form-group">
              <label>Authors</label>
              <input
                type="text"
                value={formData.authors}
                onChange={(e) =>
                  setFormData({ ...formData, authors: e.target.value })
                }
                placeholder="e.g., J.K. Rowling"
              />
            </div>
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
                placeholder="e.g., 9780590353427"
              />
            </div>
            <div className="form-group">
              <label>Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
                placeholder="e.g., Scholastic"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Starting Page</label>
            <input
              type="number"
              min="1"
              value={formData.page}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  page: parseInt(e.target.value) || 1,
                })
              }
            />
            <small>Start fetching from this page number</small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Importing..." : "Import Books"}
          </button>
        </form>

        {importedBooks.length > 0 && (
          <div className="imported-books-section">
            <h2>Imported Books</h2>
            <div className="imported-books-list">
              {importedBooks.map((book) => (
                <div key={book.id} className="imported-book-card">
                  <h3>{book.title}</h3>
                  <p>
                    <strong>Authors:</strong> {book.authors}
                  </p>
                  {book.isbn && (
                    <p>
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                  )}
                  {book.publisher && (
                    <p>
                      <strong>Publisher:</strong> {book.publisher}
                    </p>
                  )}
                  {book.publication_date && (
                    <p>
                      <strong>Published:</strong> {book.publication_date}
                    </p>
                  )}
                  <p>
                    <strong>Stock:</strong> {book.stock}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImportBooks;
