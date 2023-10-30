const Music = require('../models/cards');

const createMyMusic = (req, res, next) => {
  const { title, image } = req.body;
  Music.create({
    title,
    image,
  })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports = {
  createMyMusic,
};
