const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    console.log(mongoose.connection.name)
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectToDB;
