const express = require("express");
const router = express.Router();
const {userController} = require("../controllers");
const auth = require("../middleware/auth");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", auth,userController.getUserProfile);
router.post('/reset-password', userController.resetPassword);

module.exports = router