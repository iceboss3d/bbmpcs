var express = require("express");
const AccountController = require("../controllers/AccountController");

var router = express.Router();

router.post("/", AccountController.createAccount);
// router.get("/:id", BookController.bookDetail);
router.get("/pending", AccountController.pendingAccounts);
router.get("/", AccountController.accountList);
router.get("/:id", AccountController.accountById);
router.get("/pending/:id", AccountController.accountById);
router.get("/n/:accountNumber", AccountController.accountNumber);
router.get("/u/:userId", AccountController.accountUser);
// router.post("/", BookController.bookStore);
router.put("/:id", AccountController.accountUpdate);
// router.delete("/:id", BookController.bookDelete);

module.exports = router;
