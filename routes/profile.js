var express = require("express");
const UserController = require("../controllers/UserController");

var router = express.Router();

router.put("/bank", UserController.updateBank);
router.put("/contact", UserController.updateContact);
router.get("/bank", UserController.updateBank);
router.get("/contact", UserController.updateContact);

module.exports = router;
