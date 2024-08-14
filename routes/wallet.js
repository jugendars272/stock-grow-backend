const express = require("express");
const router = express.Router();
const {walletController} = require("../controllers");
const auth = require("../middleware/auth");

router.post('/', auth, walletController.add);
router.post('/withdraw', auth, walletController.withdraw);

module.exports = router;