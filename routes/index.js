const express = require("express");
const userRouter = require("./user");
const watchlistRouter = require("./watchlist");
const statesRouter = require("./states");
const walletRouter = require("./wallet");
const portfolioRouter = require("./portfolio");
const chartRouter = require("./chart");

const router = express.Router();
router.use('/user', userRouter);
router.use('/watchlist', watchlistRouter);
router.use('/states',statesRouter);
router.use('/wallet', walletRouter);
router.use('/portfolio', portfolioRouter);
router.use('/chart',chartRouter);

module.exports = router;
