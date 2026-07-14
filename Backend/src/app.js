import "dotenv/config.js";
import express from "express";
import { searchRouter } from "./routes/search.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/search", searchRouter);

app.use(errorHandler);
export default app;
