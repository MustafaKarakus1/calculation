const express = require('express');
const router = express.Router();
const calculateRoutes = require('./calculateRoutes');
const parserRoutes = require('./parserRoutes');

router.use('/api', calculateRoutes);
router.use('/api', parserRoutes);

module.exports = router; 
