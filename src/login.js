const { Router } = require('express');

const crypto = require('crypto');

const loginRoutes = Router();

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

loginRoutes.post('/', (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const token = generateToken();
    return res.status(200).json({ token });
  }
});

module.exports = loginRoutes;