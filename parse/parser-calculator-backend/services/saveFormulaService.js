const FunctionModel = require('../models/FunctionModel');  
  
exports.save = async function (formula,frameId,name,unit) {
  const newFunction = new FunctionModel({ formula , frameId,name,unit});
  return await newFunction.save();
};

exports.getAll = async function () {
  return await FunctionModel.find().sort({ createdAt: -1 });
};