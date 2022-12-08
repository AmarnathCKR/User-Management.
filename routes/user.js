const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.userSignin);
router.post("/", userController.userVerification);

router.get("/dashboard", userController.dashboard);

router.get("/signup", userController.userSignup);
router.post("/signup", userController.insertUser);

router.get("/logout", userController.userLogOut);

module.exports = router;
