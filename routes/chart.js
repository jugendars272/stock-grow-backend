const express = require("express");
const router = express.Router();
const {chartController} = require("../controllers");

router.get('/chartData', chartController.fetchChartData);

module.exports = router;