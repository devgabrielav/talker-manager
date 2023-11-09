const { Router } = require('express');
const crypto = require('crypto');
const { validatePropertiesLogin, validateNotEmpty, validateLogin } = require('./middlewaresLogin');

const loginRoutes = Router();

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

loginRoutes.post('/', validatePropertiesLogin, validateNotEmpty, validateLogin, (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

module.exports = loginRoutes;