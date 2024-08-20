const express = require("express");
const router = express.Router();
const {statesController} = require("../controllers");
const auth = require("../middleware/auth");

router.get('/', auth, statesController.getStates);
router.get('/transection', auth, statesController.getTransections);

module.exports = router;