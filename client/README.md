# Library Management System - React Frontend

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Features

### Books Management

- View all books
- Search books by title and/or author
- Add new books
- Edit existing books
- Delete books
- Track book stock

### Members Management

- View all members
- Add new members
- Edit existing members
- Delete members
- Track outstanding debt (highlighted if ≥ Rs. 500)

### Transactions

- View all transactions
- Filter by status (All, Active, Returned)
- Issue books to members (with validation for stock and debt limit)
- Return books with rent fee
- View transaction history

### Import Books

- Import books from Frappe Library API
- Specify number of books to import
- Filter by title, authors, ISBN, publisher
- View imported books

## API Integration

The frontend communicates with the Django backend running on `http://127.0.0.1:8000`. The Vite dev server is configured to proxy API requests.
