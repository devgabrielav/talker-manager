const { Router } = require('express');
const fs = require('fs').promises;
const { join } = require('path');

const talkerRoutes = Router();

const path = '/talker.json';

talkerRoutes.get('/', async (req, res) => {
  const allTalkers = await fs.readFile(join(__dirname, path), 'utf8');
  const parsed = JSON.parse(allTalkers);

  if (!allTalkers) {
    return res.status(200).json([]);
  }
  return res.status(200).json(parsed);
});

module.exports = talkerRoutes;