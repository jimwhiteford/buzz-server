const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function dbConnect() {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB!");
      console.error(error);
    });
}

module.exports = dbConnect;
