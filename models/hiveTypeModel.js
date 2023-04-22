const mongoose = require("mongoose");

const HiveType = new mongoose.Schema({
  hiveModel: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports =
  mongoose.model.HiveType || mongoose.model("HiveTypes", HiveType);
