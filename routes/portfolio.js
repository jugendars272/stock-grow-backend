const express = require("express");
const router = express.Router();
const {portfolioController} = require("../controllers");
const auth = require("../middleware/auth");

router.post('/buy', auth, portfolioController.buyStock);
router.post('/sell', auth, portfolioController.sellStock);
router.post('/shortSell', auth, portfolioController.shortSell);
router.post('/coverShort', auth, portfolioController.coverShort);

router.get('/getPortfolio', auth, portfolioController.getPortfolio);

module.exports = router;