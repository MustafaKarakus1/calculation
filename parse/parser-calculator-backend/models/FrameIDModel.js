const mongoose = require('mongoose');

const frameIDSchema = new mongoose.Schema({
  frameId: {type: String, required: true,},
});

const frameparsers = mongoose.model('frameparsers', frameIDSchema);

module.exports = frameparsers;