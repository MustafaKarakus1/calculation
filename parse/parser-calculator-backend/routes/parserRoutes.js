const express = require('express');
const router = express.Router();
const parserController = require('../controllers/parserController');

router.get('/parser-values', parserController.getParserValues);
router.post('/reset-values', parserController.resetParserValues);

module.exports = router;
