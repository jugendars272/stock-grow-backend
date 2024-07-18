const express = require("express");
const router = express.Router();
const {watchlistController} = require("../controllers");
const auth = require("../middleware/auth");

router.post("/add",auth, watchlistController.add);
router.get("/get",auth, watchlistController.getWatchlist);
router.delete("/delete",auth, watchlistController.deleteTicker);

module.exports = router