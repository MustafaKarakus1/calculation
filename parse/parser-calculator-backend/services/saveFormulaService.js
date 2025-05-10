const FunctionModel = require('../models/FunctionModel');  
  
exports.save = async function (functions) {
  const newFunction = new FunctionModel({ functions });
  return await newFunction.save();
};

exports.getAll = async function () {
  return await FunctionModel.find().sort({ createdAt: -1 });
};