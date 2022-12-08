const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/signin", adminController.adminSignin);

router.get('/dashboard', adminController.adminDashboard)
router.post("/dashboard", adminController.adminVerification);

router.get('/adduser', adminController.addUserPage)
router.post('/adduser', adminController.addUser);

router.get('/delete-user', adminController.deleteUser)

router.get('/edit-user', adminController.editUser)
router.post('/edit-user', adminController.adminEdited)

router.get('/logout', adminController.adminLogOut)

module.exports = router;
