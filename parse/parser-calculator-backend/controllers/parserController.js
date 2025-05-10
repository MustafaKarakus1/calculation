const { parserValues, generateRandomValues } = require('../models/parserValues');

exports.getParserValues = (req, res) => {
  res.json({ success: true, values: parserValues });
};

exports.resetParserValues = (req, res) => {
  const newValues = generateRandomValues();
  res.json({ success: true, values: newValues });
};
