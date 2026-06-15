require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const generateEmbedding = require("./src/services/generateEmbedding.services");

connectToDB();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// generateEmbedding();
