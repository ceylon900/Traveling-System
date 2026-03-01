const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminuserController");

router.get("/users", adminController.getAllUsers);
router.delete("/users/suspend/:id", adminController.suspendUser);

module.exports = router;