require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.API_PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database
const accountMap = [];

// Generate a random 10-digit account number as a string
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

// Generate a random 11-digit BVN as a string
const generateBVN = () => {
  return Math.floor(10000000000 + Math.random() * 90000000000).toString();
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
  // Check if there are any accounts
  if (accountMap.length === 0) {
    return res.status(404).json({ error: "No accounts found" });
  }
  // Map the accounts to a simpler structure
  const accounts = accountMap.map((account) => ({
    accountNumber: account.accountNumber,
    name: account.name,
    balance: account.balance,
    bvnVerification: account.bvnVerification,
  }));

  // Return the accounts
  res.status(200).json({ accounts });
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
app.put("/accounts/:accountNumber", (req, res) => {
  // Find the account by account number
  const account = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );

  if (!account) {
    return res.status(404).json({
      error: `Accout not found!`,
    });
  }

  if (req.body.name) {
    account.name = req.body.name;
  }

  if (req.body.bvnVerification) {
    account.bvnVerification = req.body.bvnVerification;
    // Check if BVN verification is done
    // If it is, generate a new BVN, otherwise reset it
    if (account.bvnVerification) {
      account.bvn = generateBVN(); // Generate a new BVN if verification is done
    } else {
      account.bvn = null; // Reset BVN if verification is not done
    }
  }

  res.status(200).json({ account: accountMap });
});

// @desc Delete a particular account
// @route DELETE /accounts/:accountNumber
// @access private
app.delete("/accounts/:accountNumber", (req, res) => {
  console.log(req.params.accountNumber);
  // Find the account by account number
  const account = accountMap.findIndex(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );

  // If account not found, return 404
  if (account === -1) {
    return res.status(404).json({ error: "Account not found" });
  }

  accountMap.splice(account, 1);
  res.status(204).send({ message: "Account Deleted Successfully" });
});

// Additional banking operations

// @desc Deposit money
// @route POST /api/v1/accounts/:id/deposit
// @access private
app.post("/accounts/:accountNumber/deposit", (req, res) => {
  // Find the account by account number
  const account = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );

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
app.post("/accounts/:accountNumber/withdraw", (req, res) => {
  // Find the account by account number
  const account = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );

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
