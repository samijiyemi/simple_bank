const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Account routes
router.post("/accounts", accountController.createAccount);
router.get("/accounts", accountController.getAllAccounts);
router.get("/accounts/:accountNumber", accountController.getAccount);
router.put("/accounts/:accountNumber", accountController.updateAccount);
router.delete("/accounts/:accountNumber", accountController.deleteAccount);
router.post("/accounts/:accountNumber/deposit", accountController.deposit);
router.post("/accounts/:accountNumber/withdraw", accountController.withdraw);
router.post("/accounts/:accountNumber/transfer", accountController.transfer);
// Add more routes as needed

module.exports = router;
