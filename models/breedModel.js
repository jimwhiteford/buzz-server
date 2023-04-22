const mongoose = require("mongoose");

const Breed = new mongoose.Schema({
  breed: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model.Breed || mongoose.model("Breeds", Breed);
