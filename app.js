const express = require('express');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
// user
const routerUser = require('./routes/user');
const { createUser, LoginUser } = require('./constrollers/User');
const routerMusic = require('./routes/Music');
const auth = require('./middlewares/auth');
const { errorLoggerApp } = require('./middlewares/loggers');
// puerto
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/M-A-M');
// App
app.use(express.json());
app.use(cors());
app.options('*', cors());
// crash server
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

// Register user
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(1),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      avatar: Joi.string().required(),
    }),
  }),
  createUser,
);

app.post(
  '/singIn',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  LoginUser,
);
app.use(auth);
app.use('/users', routerUser);
app.use('/music', routerMusic);

app.use(errorLoggerApp);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});
app.use((err, req, res, next) => {
  switch (true) {
    case err.name === 'CastError':
      res.status(400).send({
        message:
          'Se pasaron datos inválidos a los métodos para crear un usuario/tarjeta o actualizar el avatar/perfil de un usuario.',
      });
      break;

    case err.name === 'DocumentNotFoundError':
      res.status(404).send({
        message:
          'No existe un usuario con el id solicitado o la solicitud se envió a una dirección inexistente;',
      });
      break;

    case err.name === '11000':
      res.status(409).send({
        message:
          'Al registrarse, se especificó un correo electrónico que ya existe en el servidor',
      });
      break;
  }
});
app.listen(PORT);
