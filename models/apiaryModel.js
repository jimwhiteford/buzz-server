const mongoose = require("mongoose");

const Apiary = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please provide a user Email"],
    unique: false,
  },
  title: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [false],
  },
  slug: {
    type: String,
    required: true,
    unique: false,
  },
  photo: {
    type: String,
    required: true,
    unique: false,
  },
});

module.exports = mongoose.model.Apiarys || mongoose.model("Apiarys", Apiary);
