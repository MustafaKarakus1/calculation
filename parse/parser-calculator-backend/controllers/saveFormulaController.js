const saveFormulaService = require("../services/saveFormulaService");

exports.saveFormula = async (req, res) => {
  try {
    const { formula , frameId , name, unit} = req.body;
    if (!Array.isArray(formula)) {
      return res.status(400).json({ success: false, message: "Functions must be an array" });
    }

    const saved = await saveFormulaService.save(formula,frameId,name,unit);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};