const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

const validationRatePatch = (rate) => {
  const rateType = typeof Number(rate) === 'number' && Number
    .isInteger(Number(rate)) && Number(rate) >= 1 && Number(rate) <= 5;
  if (!rateType) {
    return 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  }
  return true;
};

const validationRate = (rate) => {
  const changeType = Number(rate);
  if (typeof changeType !== 'number') {
    return 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  }
  
  if (Number(rate) > 5 || Number(rate) < 1 || !Number.isInteger(Number(rate))) {
    return 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  }

  return false;
};

const validationDate = (date) => {
  const dateType = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  const validateDate = dateType.test(date);

  if (!validateDate) {
    return 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"';
  }
  return false;
};

module.exports = {
  generateToken,
  validationRatePatch,
  validationRate,
  validationDate,
};