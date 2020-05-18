var express = require("express");
const UserController = require("../controllers/UserController");

var router = express.Router();

router.put("/bank", UserController.updateBank);
router.put("/contact", UserController.updateContact);
router.put("/kyc", UserController.updateKyc);
router.get("/bank", UserController.getBank);
router.get("/bank/:uid", UserController.getUserBank);
router.get("/contact", UserController.getContact);
router.get("/contact/:id", UserController.getUserContact);
router.get("/kyc", UserController.getKyc);
router.get("/kyc/:id", UserController.getUserKyc);
router.get("/user/:id", UserController.getUser);
router.get("/user", UserController.getUsers);

module.exports = router;
