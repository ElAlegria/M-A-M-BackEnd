const mongoose = require('mongoose');

const MusicSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
      validate: {
        validator(link) {
          const urlRegex = /^(http|https):\/\/(www\.)?[\w.~:/?%#[\]@!$&'()*+,;=-]+[#]?$/;
          return urlRegex.test(link);
        },
        message: (props) => `${props.value} no es una URL válida`,
      },
    },
    // like: {
    //  default:[]
    // },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', MusicSchema);
