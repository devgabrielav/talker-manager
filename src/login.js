const { Router } = require('express');
const { validatePropertiesLogin, validateNotEmpty, validateLogin } = require('./middlewaresLogin');
const { generateToken } = require('./helpers/helpers');

const loginRoutes = Router();

loginRoutes.post('/', validatePropertiesLogin, validateNotEmpty, validateLogin, (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

module.exports = loginRoutes;