const { parserValues } = require('../models/parserValues');

function evaluateBasicExpression(expressionString) {
  try {
    const result = eval(expressionString);
    if (typeof result !== 'number' || isNaN(result)) {
      throw new Error("Geçersiz matematiksel ifade");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

function evaluateExpression(functions) {
  try {
    const calculationSteps = [];
    let originalExpression = '';

    for (let item of functions) {
      if (item.type === "Constant") originalExpression += item.value;
      else if (item.type === "Operator") originalExpression += ' ' + item.value + ' ';
      else if (item.type === "Parantheses") originalExpression += item.value;
      else if (item.type === "Parser") originalExpression += item.value;
    }

    const hasParser = functions.some(item =>
      item.type === "Parser" && (item.value === "Yusuf" || item.value === "Mustafa")
    );

    if (!hasParser) {
      const result = evaluateBasicExpression(originalExpression);
      return {
        success: true,
        result,
        expression: originalExpression,
        steps: [{ expression: originalExpression, result }]
      };
    }

    for (let step = 0; step < 10; step++) {
      let expressionString = '';

      for (let item of functions) {
        if (item.type === "Constant") expressionString += item.value;
        else if (item.type === "Operator") expressionString += ' ' + item.value + ' ';
        else if (item.type === "Parantheses") expressionString += item.value;
        else if (item.type === "Parser") {
          if (item.value === "Yusuf") expressionString += parserValues.Yusuf[step];
          else if (item.value === "Mustafa") expressionString += parserValues.Mustafa[step];
        }
      }

      const result = evaluateBasicExpression(expressionString);
      calculationSteps.push({
        expression: expressionString,
        result,
        substitutions: {
          Yusuf: parserValues.Yusuf[step],
          Mustafa: parserValues.Mustafa[step]
        }
      });
    }

    return {
      success: true,
      result: calculationSteps[9].result,
      expression: originalExpression,
      steps: calculationSteps
    };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { evaluateExpression };
