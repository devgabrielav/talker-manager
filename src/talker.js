const { Router } = require('express');
const fs = require('fs').promises;
const { join } = require('path');

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

module.exports = talkerRoutes;