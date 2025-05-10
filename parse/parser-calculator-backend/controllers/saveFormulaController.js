const saveFormulaService = require("../services/saveFormulaService");

exports.saveFormula = async (req, res) => {
  try {
    const { functions } = req.body;
    if (!Array.isArray(functions)) {
      return res.status(400).json({ success: false, message: "Functions must be an array" });
    }

    const saved = await saveFormulaService.save(functions);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};