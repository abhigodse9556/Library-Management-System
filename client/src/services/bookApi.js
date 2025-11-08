import apiClient from "./apiClient";

export const getBooks = async (params = {}) => {
  const response = await apiClient.get("/books", { params });
  return response.data;
};

export const getBook = async (id) => {
  const response = await apiClient.get(`/books/${id}/`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await apiClient.post("/books/", bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await apiClient.put(`/books/${id}/`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await apiClient.delete(`/books/${id}/`);
  return response.data;
};

export const searchBooks = async (title = "", author = "") => {
  const response = await apiClient.get("/books", {
    params: { title, author },
  });
  return response.data;
};

export const issueBook = async (bookId, memberId) => {
  const response = await apiClient.post("/issue", {
    book_id: bookId,
    member_id: memberId,
  });
  return response.data;
};

export const returnBook = async (transactionId, rentFee = 0) => {
  const response = await apiClient.post("/return", {
    transaction_id: transactionId,
    rent_fee: rentFee,
  });
  return response.data;
};

export const importBooks = async (params = {}) => {
  const response = await apiClient.get("/import-books", { params });
  return response.data;
};
