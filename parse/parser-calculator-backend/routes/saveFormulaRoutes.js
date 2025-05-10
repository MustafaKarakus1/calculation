const express = require('express');
const router = express.Router();
const saveFormulaController = require('../controllers/saveFormulaController');

router.post("/save-formula", saveFormulaController.saveFormula);

module.exports = router;
