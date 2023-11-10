const { Router } = require('express');
const fs = require('fs').promises;
const { join } = require('path');
const { validateToken, validatePropertiesBody, 
  validatePropertiesTalk, validateName, 
  validateAge, validateWatchedAt,
  validateRate, validateTokenType, 
  validateRateSearch } = require('./middlewaresTalker');

const talkerRoutes = Router();

const path = '/talker.json';

async function readAll() {
  const allTalkers = await fs.readFile(join(__dirname, path), 'utf8');
  const parsed = JSON.parse(allTalkers);

  return parsed;
}

const getSearchBasedOnQ = async (q) => {
  const allTalkers = await readAll();
  const filteredTalkersName = await allTalkers.filter((talker) => talker.name.toLowerCase()
    .includes(q.toLowerCase()));

  if (filteredTalkersName.length === 0) {
    return [];
  }
  if (!q || q.trim().length === 0) {
    return allTalkers;
  }
  return filteredTalkersName;
};

const getSearchBasedOnRate = async (rate) => {
  const allTalkers = await readAll();
  const filteredTalkersRate = await allTalkers
    .filter((talker) => talker.talk.rate === rate);

  if (filteredTalkersRate.length === 0) {
    return [];
  }

  if (!rate) {
    return allTalkers;
  }

  return filteredTalkersRate;
};

const getBothSearches = async (q, rate) => {
  const allTalkers = await readAll();
  const filteredTalkersNameAndRate = await allTalkers
    .filter((talker) => talker.name.toLowerCase()
      .includes(q.toLowerCase()) && talker.talk.rate === rate);

  if (!rate && !q) {
    return allTalkers;
  }
  if (filteredTalkersNameAndRate.length === 0) {
    return [];
  }
  
  return filteredTalkersNameAndRate;
};

talkerRoutes.get('/', async (req, res) => {
  const allTalkers = await readAll();

  if (!allTalkers) {
    return res.status(200).json([]);
  }
  return res.status(200).json(allTalkers);
});

talkerRoutes.get('/search', validateToken, validateTokenType, validateRateSearch, 
  async (req, res) => {
    const { q, rate } = req.query;
    if (q && !rate) {
      const data = await getSearchBasedOnQ(q);
      return res.status(200).json(data);
    }
    if (!q && rate) {
      const data = await getSearchBasedOnRate(Number(rate));
      return res.status(200).json(data);
    }
    const data = await getBothSearches(q, Number(rate));
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