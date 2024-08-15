const express = require("express");
const router = express.Router();
const {portfolioController} = require("../controllers");
const auth = require("../middleware/auth");

router.post('/buy', auth, portfolioController.addStock);
router.post('/sell', auth, portfolioController.sellStock);

module.exports = router;