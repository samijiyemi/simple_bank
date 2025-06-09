import { generateAccountNumber, generateBVN } from "../utils/generators.js";

// In-memory database
const accountMap = [];

/**
 * @desc Create account for a user
 * @route POST /accounts
 * @access public
 */
export const createAccount = (req, res) => {
  const { name, balance } = req.body;
  if (
    typeof name !== "string" ||
    (typeof balance !== "number" && !name) ||
    balance === undefined
  ) {
    return res.status(400).json({ error: "Name and Balance are required" });
  }
  const newAccount = {
    accountNumber: generateAccountNumber(),
    name,
    balance: parseInt(balance),
    bvnVerification: false,
  };
  accountMap.push(newAccount);
  res.status(201).json({ account: newAccount });
};

/**
 * @desc Get all accounts
 * @route GET /accounts
 * @access public
 */
export const getAllAccounts = (req, res) => {
  if (accountMap.length === 0) {
    return res.status(404).json({ error: "No accounts found" });
  }
  const accounts = accountMap.map((account) => ({
    accountNumber: account.accountNumber,
    name: account.name,
    balance: account.balance,
    bvnVerification: account.bvnVerification,
  }));
  res.status(200).json({ accounts });
};

/**
 * @desc Get a particular account
 * @route GET /accounts/:accountNumber
 * @access public/private
 */
export const getAccount = (req, res) => {
  const account = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );
  if (!account) {
    return res.status(404).json({ error: "Account not found!" });
  }
  res.status(200).json(account);
};

/**
 * @desc Update a particular account
 * @route PUT /accounts/:accountNumber
 * @access public/private
 */
export const updateAccount = (req, res) => {
  const account = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );
  if (!account) {
    return res.status(404).json({ error: "Account not found!" });
  }
  if (req.body.name) {
    account.name = req.body.name;
  }
  if (req.body.bvnVerification) {
    account.bvnVerification = req.body.bvnVerification;
    if (account.bvnVerification) {
      account.bvn = generateBVN();
    } else {
      account.bvn = null;
    }
  }
  res.status(200).json({ account: accountMap });
};

/**
 * @desc Delete a particular account
 * @route DELETE /accounts/:accountNumber
 * @access public/private
 */
export const deleteAccount = (req, res) => {
  const account = accountMap.findIndex(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );
  if (account === -1) {
    return res.status(404).json({ error: "Account not found" });
  }
  accountMap.splice(account, 1);
  res.status(204).send({ message: "Account Deleted Successfully" });
};

/**
 * @desc Deposit money into an account
 * @route POST /accounts/:accountNumber/deposit
 * @access public/private
 */
export const deposit = (req, res) => {
  const account = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );
  if (!account) {
    return res.status(404).json({ error: "Account not found!" });
  }
  const { amount } = req.body;
  if (amount <= 0) {
    return res.status(400).json({ error: "Amount must be positive" });
  }
  account.balance += parseInt(amount);
  res.status(200).json(account);
};

/**
 * @desc Withdraw money from an account
 * @route POST /accounts/:accountNumber/withdraw
 * @access public/private
 */
export const withdraw = (req, res) => {
  const account = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );
  if (!account) {
    return res.status(404).json({ error: "Account not found!" });
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
};

/**
 * @desc Transfer money to another account
 * @route POST /accounts/:accountNumber/transfer
 * @access public/private
 */

export const transfer = (req, res) => {
  const fromAccount = accountMap.find(
    (user) => user.accountNumber === parseInt(req.params.accountNumber)
  );
  const toAccount = accountMap.find(
    (user) => user.accountNumber === parseInt(req.body.toAccountNumber)
  );

  // check if both accounts exist
  if (!fromAccount || !toAccount) {
    return res.status(404).json({ error: "One or both accounts not found!" });
  }

  const { amount } = req.body;
  if (amount <= 0) {
    return res.status(400).json({ error: "Amount must be positive" });
  }

  if (fromAccount.balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  // Deduct from sender's account and add to receiver's account
  fromAccount.balance -= parseInt(amount);
  toAccount.balance += parseInt(amount);
  res.status(200).json({
    message: `Transfer of ${amount} from account ${fromAccount.accountNumber} to account ${toAccount.accountNumber} was successful`,
    fromAccount,
    toAccount,
  });
};

// You can add transfer and other operations similarly
export { accountMap };
