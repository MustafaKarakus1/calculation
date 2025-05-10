const express = require('express');
const router = express.Router();
const calculateController = require('../controllers/calculateController');

router.post('/calculate', calculateController.calculate);
router.post('/validate-parentheses', calculateController.validateParentheses);

module.exports = router;
