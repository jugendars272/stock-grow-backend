const express = require("express");
const userRouter = require("./user");
const watchlistRouter = require("./watchlist");
const statesRouter = require("./states");

const router = express.Router();
router.use('/user', userRouter);
router.use('/watchlist', watchlistRouter);
router.use('/states',statesRouter);

module.exports = router;
