var express = require("express");
const TransactionController = require("../controllers/TransactionController");

var router = express.Router();

router.post("/", TransactionController.createTransaction);
router.post("/withdraw", TransactionController.withdraw);
router.get("/s", TransactionController.transactionListStatus);
router.get("/", TransactionController.transactionList);
router.get("/:id", TransactionController.transactionDetail);
router.get("/a/:accountNumber", TransactionController.accountTransactions);
router.put("/:id", TransactionController.verifyTransaction);

module.exports = router;