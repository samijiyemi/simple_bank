import express from "express";
import {
  createAccount,
  getAllAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  deposit,
  withdraw,
} from "../controllers/accountController.js";

const router = express.Router();

// Account routes
router.post("/accounts", createAccount);
router.get("/accounts", getAllAccounts);
router.get("/accounts/:accountNumber", getAccount);
router.put("/accounts/:accountNumber", updateAccount);
router.delete("/accounts/:accountNumber", deleteAccount);
router.post("/accounts/:accountNumber/deposit", deposit);
router.post("/accounts/:accountNumber/withdraw", withdraw);
// Add more routes as needed

export default router;
