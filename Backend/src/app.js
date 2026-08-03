import "dotenv/config.js";
import express from "express";
import { searchRouter } from "./routes/search.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { productRouter } from "./routes/product.route.js";
import { authRouter } from "./routes/auth.route.js";
import  cookieParser  from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/search", searchRouter);
app.use("/api/products", productRouter);

app.use(errorHandler);
export default app;
