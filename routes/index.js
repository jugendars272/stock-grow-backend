const express = require("express");
const userRouter = require("./user");
const watchlistRouter = require("./watchlist");

const router = express.Router();
router.use('/user', userRouter);
router.use('/watchlist', watchlistRouter);

module.exports = router;
