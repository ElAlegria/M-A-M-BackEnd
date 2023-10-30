const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/Users');

const getUser = (req, res, next) => {
  users
    .find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};
const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  users
    .findById(_id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};
const createUser = (req, res, next) => {
  const {
    name, email, password, avatar,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    users
      .create({
        name,
        email,
        password: hash,
        avatar,
      })
      .then((user) => res.send({ data: user }))
      .catch((error) => {
        if (error.code === 11000) {
          return res.send({
            message: `El email ${email} ya existe, por favor elige otro ${error}`,
          });
        }
        throw error;
      });
  });
};

const LoginUser = (req, res, next) => {
  const { email, password } = req.body;

  return users
    .findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          {
            _id: user.id,
          },
          'devSecret',
          {
            expiresIn: '7d',
          },
        ),
      });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};

const putMyList = (req, res, next) => {
  const { card, id } = req.body;
  users
    .findById(id)
    .orFail()
    .then((user) => {
      const verifyMusic = user.myList.some((music) => music.cardId === card.cardId);
      if (verifyMusic) {
        return res.send({
          message: `Error ${card.title} ya existe en tu lista`,
        });
      }
      users
        .findByIdAndUpdate(id, { $push: { myList: card } }, { new: true })
        .orFail()
        .then((user) => {
          res.send({ data: user });
        })
        .catch(next);
    })
    .catch(() => {
      res.send({ message: 'Fallo al guardar la cancion' });
    });
};

module.exports = {
  getUser,
  getUserInfo,
  createUser,
  LoginUser,
  putMyList,
};
