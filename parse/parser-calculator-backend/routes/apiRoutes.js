const express = require('express');
const router = express.Router();
const calculateRoutes = require('./calculateRoutes');
const parserRoutes = require('./parserRoutes');
const saveFormulaRoutes = require('./saveFormulaRoutes');

router.use('/api', calculateRoutes);
router.use('/api', parserRoutes);
router.use('/api', saveFormulaRoutes);
module.exports = router; 
