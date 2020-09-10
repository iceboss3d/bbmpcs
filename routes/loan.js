var express = require("express");
const LoanController = require("../controllers/LoanController");

var router = express.Router();

router.post("/", LoanController.newLoanApplication);
router.get("/:id", LoanController.getLoanDetail);
router.get("/", LoanController.getLoans);

module.exports = router;