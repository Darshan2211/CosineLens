import "dotenv/config.js";
import app from "./src/app.js";
import { connectToDB } from "./src/config/database.js";

connectToDB();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
