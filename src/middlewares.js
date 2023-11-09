const validatePropertiesLogin = (req, res, next) => {
  const requiredProperties = ['email', 'password'];

  if (requiredProperties.every((property) => property in req.body)) {
    next();
  } else if (!('email' in req.body)) {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  } else if (!('password' in req.body)) {
    res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
};

const validateNotEmpty = (req, res, next) => {
  const { email, password } = req.body;
  const emailLength = email.trim().length === 0;
  const passwordLength = password.trim().length === 0;

  if (!emailLength && !passwordLength) {
    next();
  } else if (emailLength) {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  } else if (passwordLength) {
    res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const re = /\S+@\S+\.\S+/;
  const isEmail = re.test(email);
  const passwordLength = password.trim().length >= 6;

  if (isEmail && passwordLength) {
    next();
  } else if (!isEmail) {
    res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  } else if (!passwordLength) {
    res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
};

module.exports = {
  validatePropertiesLogin,
  validateNotEmpty,
  validateLogin,
};