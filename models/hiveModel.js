const mongoose = require("mongoose");

const Hive = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please provide a user Email"],
    unique: false,
  },
  apiary: {
    type: String,
    required: [true, "Please provide an Apiary"],
    unique: false,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  slug: {
    type: String,
    required: true,
    unique: false,
  },
  photo: {
    type: String,
    unique: false,
  },
  hiveType: {
    type: String,
    unique: false,
  },
  breed: {
    type: String,
    unique: false,
  },
  queenId: {
    type: String,
    unique: false,
  },
  queenNote: {
    type: String,
    unique: false,
  },
  hiveNote: {
    type: String,
    unique: false,
  },
  broodBox: {
    type: String,
    unique: false,
  },
  supers: {
    type: String,
    unique: false,
  },
  topBar: {
    type: String,
    unique: false,
  },
});

module.exports = mongoose.model.Hives || mongoose.model("Hives", Hive);
