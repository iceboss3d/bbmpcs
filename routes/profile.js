var express = require("express");
const UserController = require("../controllers/UserController");

var router = express.Router();

router.put("/bank", UserController.updateBank);
router.put("/contact", UserController.updateContact);
router.get("/bank", UserController.getBank);
router.get("/bank/:uid", UserController.getUserBank);
router.get("/contact", UserController.getContact);
router.get("/contact/:id", UserController.getUserContact);
router.get("/user/:id", UserController.getUser);

module.exports = router;
