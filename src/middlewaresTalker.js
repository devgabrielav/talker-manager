const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    return next();
  } 
  return res.status(401).json({ message: 'Token não encontrado' });
};

const validateTokenType = (req, res, next) => {
  const { authorization } = req.headers;
  const type = typeof authorization === 'string';
  const tokenLength = authorization.trim().length === 16;

  if (type && tokenLength) {
    return next();
  } 
  return res.status(401).json({ message: 'Token inválido' });
};

const validatePropertiesBody = (req, res, next) => {
  const mainProperties = ['name', 'age', 'talk'];

  if ((mainProperties.every((property) => property in req.body))) {
    return next();
  } if (!('name' in req.body)) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  } if (!('age' in req.body)) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  } if (!('talk' in req.body)) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  } 
};

const validatePropertiesTalk = (req, res, next) => {
  const talkProperties = ['watchedAt', 'rate'];
  const { talk } = req.body;

  if (talkProperties.every((property) => property in talk)) {
    return next();
  } if (!('watchedAt' in talk)) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  } if (!('rate' in talk)) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
};

const validateName = (req, res, next) => {
  const { name } = req.body;

  const nameLength = name.length >= 3;
  
  if (nameLength) {
    return next();
  } 
  return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  const ageType = typeof age === 'number' && Number.isInteger(age) && age >= 18;

  if (ageType) {
    return next();
  } 
  return res.status(400).json(
    { message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' },
  );
};

const validateWatchedAt = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  const date = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  const validateDate = date.test(watchedAt);

  if (validateDate) {
    return next();
  } 
  return res.status(400).json(
    { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' },
  );
};

const validateRate = (req, res, next) => {
  const { rate } = req.body.talk;

  const rateType = typeof Number(rate) === 'number' && Number
    .isInteger(Number(rate)) && Number(rate) >= 1 && Number(rate) <= 5;

  if (rateType) {
    return next();
  } 
  return res.status(400).json(
    { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
  );
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

const validateRateSearch = (req, res, next) => {
  const { rate } = req.query;
  const result = validationRate(rate);

  if (rate && result !== false) {
    return res.status(400)
      .json({ message: result });
  }
  return next();
};

module.exports = {
  validateToken,
  validateTokenType,
  validatePropertiesBody,
  validatePropertiesTalk,
  validateName,
  validateAge,
  validateWatchedAt,
  validateRate,
  validateRateSearch,
};