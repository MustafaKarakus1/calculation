let parserValues = {
  Yusuf: [],
  Mustafa: []
};

const generateRandomValues = () => {
  parserValues.Yusuf = Array.from({ length: 10 }, () => Math.floor(Math.random() * 900) + 100);
  parserValues.Mustafa = Array.from({ length: 10 }, () => Math.floor(Math.random() * 900) + 100);
  return parserValues;
};

generateRandomValues();

module.exports = {
  parserValues,
  generateRandomValues
};
