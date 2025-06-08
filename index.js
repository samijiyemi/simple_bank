require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.API_PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory database
const accountMap = [];

// Generate a random 10-digit account number as a string
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

// @desc Create account for a user
// @route POST /accounts
// @access public
app.post("/accounts", (req, res) => {
  const { name, balance } = req.body;

  //   check if the request is valid
  if (
    typeof name !== "string" ||
    (typeof balance !== "number" && !name) ||
    balance === undefined
  ) {
    return res.status(400).json({ error: "Name and Balance are required" });
  }

  //   create new account
  const newAccount = {
    accountNumber: generateAccountNumber(),
    name,
    balance: parseInt(balance),
    bvnVerification: false,
  };

  //   Add to the in-memory database
  accountMap.push(newAccount);

  //   Response to the user
  res.status(201).json({ account: newAccount });
});

// @desc Get All Accounts
// @route GET /accounts
// @access public
app.get("/accounts", (req, res) => {
  res.status(200).json({ accounts: accountMap });
});

// @desc Get a particular account
// @route GET /accounts/:accountNumber
// @access private
app.get("/accounts/:accountNumber", (req, res) => {
  // Find the account by account number
  const account = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );

  if (!account) {
    return res.status(404).json({
      error: `Accout not found!`,
    });
  }

  res.status(200).json(account);
});

// @desc Update a particular account
// @route PUT /api/v1/accounts/:id
// @access private
app.put("/api/v1/accounts/:id", (req, res) => {
  const { name, initialBalance } = req.body;
  const account = accountMap.find((u) => u.id === parseInt(req.params.id));

  if (!account) {
    return res.status(404).json({
      error: `Accout not found!`,
    });
  }

  if (req.body.name) {
    account.name = name;
  }

  if (req.body.initialBalance !== undefined) {
    account.balance = parseInt(initialBalance);
  }

  res.status(200).json({ account: accountMap });
});

// @desc Delete a particular account
// @route DELETE /api/v1/accounts/:id
// @access private
app.delete("/api/v1/accounts/:id", (req, res) => {
  const account = accountMap.findIndex((u) => u.id === parseInt(req.params.id));

  if (account === -1) {
    return res.status(404).json({
      error: `Accout not found!`,
    });
  }

  accountMap.splice(account, 1);
  res.status(204).end();
});

// Additional banking operations

// @desc Deposit money
// @route POST /api/v1/accounts/:id/deposit
// @access private
app.post("/api/v1/accounts/:id/deposit", (req, res) => {
  const account = accountMap.find((u) => u.id === parseInt(req.params.id));

  if (!account) {
    return res.status(404).json({
      error: `Accout not found!`,
    });
  }

  const { amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ error: "Amount must be positive" });
  }

  account.balance += parseInt(amount);
  res.status(200).json(account);
});

// @desc Withdraw money
// @route POST /api/v1/accounts/:id/withdraw
// @access private
app.post("/api/v1/accounts/:id/withdraw", (req, res) => {
  const account = accountMap.find((u) => u.id === parseInt(req.params.id));

  if (!account) {
    return res.status(404).json({
      error: `Accout not found!`,
    });
  }

  const { amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ error: "Amount must be positive" });
  }

  if (account.balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  account.balance -= amount;
  res.status(200).json({
    message: `Your withdraw of ${parseInt(amount)} was successful`,
    account,
  });
});

// @desc Transfer money
// @route DELETE /api/v1/accounts/transfer
// @access private
app.post("/api/v1/accounts/transfer", (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ error: "Amount must be positive" });
  }

  const fromAccount = accountMap.find((a) => a.id === parseInt(fromAccountId));
  const toAccount = accountMap.find((a) => a.id === parseInt(toAccountId));

  if (!fromAccount || !toAccount) {
    return res
      .status(404)
      .json({ error: "One of those account is not found!" });
  }

  if (fromAccount.balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  fromAccount.balance -= parseInt(amount);
  toAccount.balance += parseInt(amount);

  res.status(200).json({
    message: `Transfer successful`,
    fromAccount,
    toAccount,
  });
});

const server = app.listen(port, () => {
  console.log(`server runing on port ${port}`);
});

// handle unhandle rejecttion
server.on("unhandledRejection", (error) => {
  console.log("unhandlerejection", error.message);
});
