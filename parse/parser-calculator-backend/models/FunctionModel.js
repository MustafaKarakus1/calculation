const mongoose = require("mongoose");

const FunctionItemSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const FunctionSchema = new mongoose.Schema({
  frameId: {type: String, required: true} ,
  name : {type: String, required: true},
  unit : {type: String , required: true},
  formula: { type: [FunctionItemSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Formula", FunctionSchema);
