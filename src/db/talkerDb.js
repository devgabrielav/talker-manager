const connection = require('./connection');

const getAllTalkers = async () => {
  const [talkers] = await connection.execute('SELECT * FROM talkers');
  const correctFormat = talkers
    .map(({ talk_watched_at: watchedAt, talk_rate: rate, ...talker }) => ({
      ...talker,
      talk: {
        watchedAt,
        rate,
      },
    }));
  return correctFormat;
};

module.exports = {
  getAllTalkers,
};