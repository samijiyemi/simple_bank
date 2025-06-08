# Simple Bank API

A simple RESTful API for basic banking operations, built with Node.js and Express. This project demonstrates a clean folder structure using controllers, routes, and utility modules. All data is stored in-memory (no database required).

## Features

- Create a new bank account
- Retrieve all accounts or a specific account
- Update account details (including BVN verification)
- Delete an account
- Deposit and withdraw funds
- Generate unique account numbers and BVNs

## Project Structure

```
├── index.js                # Entry point, sets up Express and routes
├── controllers/
│   └── accountController.js # Business logic for account operations
├── routes/
│   └── accountRoutes.js     # Express routes for account endpoints
├── utils/
│   └── generators.js        # Utility functions for account number and BVN generation
├── package.json
└── README.md
```

## API Endpoints

### Account Management

- `POST   /accounts` - Create a new account
- `GET    /accounts` - Get all accounts
- `GET    /accounts/:accountNumber` - Get a specific account
- `PUT    /accounts/:accountNumber` - Update account details
- `DELETE /accounts/:accountNumber` - Delete an account

### Transactions

- `POST /accounts/:accountNumber/deposit` - Deposit money
- `POST /accounts/:accountNumber/withdraw` - Withdraw money

## Request/Response Examples

### Create Account

**POST /accounts**

```json
{
  "name": "John Doe",
  "balance": 1000
}
```

### Deposit

**POST /accounts/1234567890/deposit**

```json
{
  "amount": 500
}
```

### Withdraw

**POST /accounts/1234567890/withdraw**

```json
{
  "amount": 200
}
```

## Setup & Run

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```
4. The API will be available at `http://localhost:3000` (or the port set in `.env`)

## Notes

- All data is stored in-memory and will be lost when the server restarts.
- BVN and account numbers are randomly generated and not guaranteed to be unique in a production environment.

## License

MIT
