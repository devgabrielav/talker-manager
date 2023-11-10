const { Router } = require('express');
const fs = require('fs').promises;
const { join } = require('path');
const { validateToken, validatePropertiesBody, 
  validatePropertiesTalk, validateName, 
  validateAge, validateWatchedAt,
  validateRate, validateTokenType, 
  validateRateSearch, validateWatchedSearch } = require('./middlewaresTalker');

const talkerRoutes = Router();

const path = '/talker.json';

async function readAll() {
  const allTalkers = await fs.readFile(join(__dirname, path), 'utf8');
  const parsed = JSON.parse(allTalkers);

  return parsed;
}

const getSearchAll = async (q, rate, date) => {
  const allTalkers = await readAll();
  const filteredTalkers = await allTalkers
    .filter((talker) => (q ? talker.name.toLowerCase().includes(q.toLowerCase()) : true))
    .filter((talker) => (rate ? talker.talk.rate === Number(rate) : true))
    .filter((talker) => (date ? talker.talk.watchedAt === date : true));
  return filteredTalkers;
}; 

talkerRoutes.get('/', async (req, res) => {
  const allTalkers = await readAll();

  if (!allTalkers) {
    return res.status(200).json([]);
  }
  return res.status(200).json(allTalkers);
});

talkerRoutes.get('/search', validateToken, validateTokenType, validateRateSearch, 
  validateWatchedSearch, async (req, res) => {
    const { q, rate, date } = req.query;
    const allTalkers = await readAll();
    const data = await getSearchAll(q, rate, date);

    if (data.length === 0) {
      return res.status(200).json([]);
    }
    if (!q && !rate && !date) {
      return res.status(200).json(allTalkers);
    }
    return res.status(200).json(data);
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

talkerRoutes.put('/:id', validateToken, validateTokenType, validatePropertiesBody, 
  validatePropertiesTalk, validateName, validateAge, 
  validateWatchedAt, validateRate, async (req, res) => {
    const { id } = req.params;
    const allTalkers = await readAll();
    const correctTalker = allTalkers.find((talker) => talker.id === Number(id));

    if (!correctTalker) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    } 
    const { name, age, talk } = req.body;
    const index = allTalkers.indexOf(correctTalker);
    allTalkers[index] = { ...allTalkers[index], name, age, talk };
    fs.writeFile(join(__dirname, path), JSON.stringify(allTalkers));
    return res.status(200).json(allTalkers[index]);
  });

talkerRoutes.delete('/:id', validateToken, validateTokenType, async (req, res) => {
  const { id } = req.params;
  const allTalkers = await readAll();
  const correctTalker = allTalkers.findIndex((talker) => talker.id === Number(id));

  if (!correctTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  allTalkers.splice(correctTalker, 1);
  fs.writeFile(join(__dirname, path), JSON.stringify(allTalkers));

  res.status(204).end();
});

module.exports = {
  talkerRoutes,
  readAll,
};