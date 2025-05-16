const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/', apiRoutes);

module.exports = app;
