const API_BASE_URL = "/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Network error" }));
    throw new Error(error.error || error.message || "An error occurred");
  }
  return response.json();
};

// Books API
export const getBooks = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/books${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(url);
  const data = await handleResponse(response);
  return data;
};

export const getBook = async (id) => {
  const response = await fetch(`${API_BASE_URL}/books/${id}/`);
  const data = await handleResponse(response);
  return data;
};

export const createBook = async (bookData) => {
  const response = await fetch(`${API_BASE_URL}/books/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });
  return handleResponse(response);
};

export const updateBook = async (id, bookData) => {
  const response = await fetch(`${API_BASE_URL}/books/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });
  return handleResponse(response);
};

export const deleteBook = async (id) => {
  const response = await fetch(`${API_BASE_URL}/books/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Network error" }));
    throw new Error(error.error || error.message || "Failed to delete book");
  }
};

export const searchBooks = async (title = "", author = "") => {
  const params = {};
  if (title) params.title = title;
  if (author) params.author = author;
  return getBooks(params);
};

// Members API
export const getMembers = async () => {
  const response = await fetch(`${API_BASE_URL}/members/`);
  const data = await handleResponse(response);
  return data;
};

export const getMember = async (id) => {
  const response = await fetch(`${API_BASE_URL}/members/${id}/`);
  const data = await handleResponse(response);
  return data;
};

export const createMember = async (memberData) => {
  const response = await fetch(`${API_BASE_URL}/members/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });
  return handleResponse(response);
};

export const updateMember = async (id, memberData) => {
  const response = await fetch(`${API_BASE_URL}/members/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });
  return handleResponse(response);
};

export const deleteMember = async (id) => {
  const response = await fetch(`${API_BASE_URL}/members/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Network error" }));
    throw new Error(error.error || error.message || "Failed to delete member");
  }
};

// Transactions API
export const getTransactions = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/transactions${
    queryString ? `?${queryString}` : ""
  }`;
  const response = await fetch(url);
  const data = await handleResponse(response);
  return data;
};

export const issueBook = async (bookId, memberId) => {
  const response = await fetch(`${API_BASE_URL}/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      book_id: bookId,
      member_id: memberId,
    }),
  });
  return handleResponse(response);
};

export const returnBook = async (transactionId, rentFee = 0) => {
  const response = await fetch(`${API_BASE_URL}/return`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_id: transactionId,
      rent_fee: rentFee,
    }),
  });
  return handleResponse(response);
};

// Import Books API
export const importBooks = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/import-books?${queryString}`);
  return handleResponse(response);
};
