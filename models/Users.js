const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Formato de Correo incorrecto',
      },
    },
    password: {
      type: String,
      require: true,
      select: true,
    },
    avatar: {
      type: String,
      require: true,
      validate: {
        validator() {
          return /https?:\/\/(www)?[\w._~:?%#[\]@!$&'()*+,;=-]+\/?/;
        },
      },
    },
    myList: [
      {
        title: {
          type: String,
        },

        image: {
          type: String,
          validate: {
            validator() {
              return /https?:\/\/(www)?[\w._~:?%#[\]@!$&'()*+,;=-]+\/?/;
            },
          },
        },
        cardId: {
          type: String,
          // require: true,
        },
      },
    ],
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Correo o contraseña incorrecta'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Correo o contraseña incorrecta'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
