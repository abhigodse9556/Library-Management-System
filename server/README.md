# Library Management System - Django Backend

## Setup

1. Create a virtual environment (optional but recommended):

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**Note**: After activating the virtual environment, you can use `python` and `pip` instead of `python3` and `pip3`. If you're not using a virtual environment, use `python3` and `pip3` commands.

2. Install dependencies:

```bash
pip3 install -r requirements.txt
```

**Note**: If `pip3` is not found, install it first:

```bash
sudo apt install python3-pip
```

3. Run migrations:

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

4. Create a superuser (optional, for Django admin):

```bash
python3 manage.py createsuperuser
```

5. Run the development server:

```bash
python3 manage.py runserver
```

The server will run on `http://127.0.0.1:8000/`

## API Endpoints

### Books

- `GET /api/books` - List all books
- `GET /api/books?search=query` - Search books by title/author
- `GET /api/books?title=harry&author=rowling` - Filter books
- `GET /api/books/<id>` - Get book details
- `POST /api/books` - Create a book
- `PUT /api/books/<id>` - Update a book
- `DELETE /api/books/<id>` - Delete a book

### Members

- `GET /api/members` - List all members
- `GET /api/members/<id>` - Get member details
- `POST /api/members` - Create a member
- `PUT /api/members/<id>` - Update a member
- `DELETE /api/members/<id>` - Delete a member

### Transactions

- `GET /api/transactions` - List all transactions
- `GET /api/transactions?member=<id>` - Get transactions by member
- `GET /api/transactions?book=<id>` - Get transactions by book
- `GET /api/transactions?is_active=true` - Get active transactions
- `GET /api/transactions/<id>` - Get transaction details

### Issue Book

- `POST /api/issue` - Issue a book to a member
  ```json
  {
    "book_id": 1,
    "member_id": 1
  }
  ```

### Return Book

- `POST /api/return` - Return a book and charge rent fee
  ```json
  {
    "transaction_id": 1,
    "rent_fee": 50.0
  }
  ```

### Import Books

- `GET /api/import-books?count=40&title=harry` - Import books from Frappe API
  - Parameters: `count`, `title`, `authors`, `isbn`, `publisher`, `page`
