const express = require('express');
const router = express.Router();
const calculateRoutes = require('./calculateRoutes');
const parserRoutes = require('./parserRoutes');
const saveFormulaRoutes = require('./saveFormulaRoutes');
const frameIDRoutes = require('./frameIDRoutes')

router.use('/api', calculateRoutes);
router.use('/api', parserRoutes);
router.use('/api', saveFormulaRoutes);
router.use('/api', frameIDRoutes);

module.exports = router; 
