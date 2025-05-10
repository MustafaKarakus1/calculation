const mongoose = require("mongoose");

const FunctionItemSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const FunctionSchema = new mongoose.Schema({
  functions: { type: [FunctionItemSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Function", FunctionSchema);
