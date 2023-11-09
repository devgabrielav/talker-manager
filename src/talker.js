const { Router } = require('express');
const fs = require('fs').promises;
const { join } = require('path');
const { validateToken, validatePropertiesBody, 
  validatePropertiesTalk, validateName, 
  validateAge, validateWatchedAt,
  validateRate, validateTokenType } = require('./middlewaresTalker');

const talkerRoutes = Router();

const path = '/talker.json';

async function readAll() {
  const allTalkers = await fs.readFile(join(__dirname, path), 'utf8');
  const parsed = JSON.parse(allTalkers);

  return parsed;
}

talkerRoutes.get('/', async (req, res) => {
  const allTalkers = await readAll();

  if (!allTalkers) {
    return res.status(200).json([]);
  }
  return res.status(200).json(allTalkers);
});

talkerRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const allTalkers = await readAll();

  const correctTalker = allTalkers.find((talker) => talker.id === Number(id));

  if (correctTalker) {
    return res.status(200).json(correctTalker);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

talkerRoutes.post('/', validateToken, validateTokenType, validatePropertiesBody, 
  validatePropertiesTalk, validateName, validateAge, 
  validateWatchedAt, validateRate, async (req, res) => {
    const { name, age, talk } = req.body;
    const allTalkers = await readAll();
    const lastIndex = allTalkers.length - 1;
    const lastId = allTalkers[lastIndex];
    const data = JSON.stringify([
      ...allTalkers,
      {
        id: lastId.id + 1,
        name,
        age,
        talk,
      },
    ]);
    fs.writeFile(join(__dirname, path), data);
    return res.status(201).json({ id: lastId.id + 1, name, age, talk });
  });

module.exports = talkerRoutes;