const { evaluateExpression } = require('../services/calculateService');

exports.calculate = (req, res) => {
  const { functions } = req.body;
  const result = evaluateExpression(functions);
  res.json(result);
};

exports.validateParentheses = (req, res) => {
  const { functions } = req.body;
  let open = 0;

  for (const item of functions) {
    if (item.type === "Parantheses") {
      if (item.value === "(") open++;
      else if (item.value === ")") open--;
      if (open < 0) {
        return res.json({
          success: false,
          error: "Parantez hatası: Kapatılan parantez sayısı fazla."
        });
      }
    }
  }

  if (open > 0) {
    return res.json({
      success: false,
      error: "Parantez hatası: Açılan tüm parantezler kapatılmamış."
    });
  }

  res.json({
    success: true,
    message: "Parantezler doğru şekilde eşleştirilmiş."
  });
};
