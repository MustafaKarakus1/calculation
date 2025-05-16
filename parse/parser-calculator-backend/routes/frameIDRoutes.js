const express = require('express');
const router = express.Router();
const frameIDController = require('../controllers/frameIDController');

router.get("/frame-ids", frameIDController.getFrameIDs);

module.exports = router;
