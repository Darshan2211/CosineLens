import "dotenv/config.js";
import express from "express";
import { searchRouter } from "./routes/search.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { productRouter } from "./routes/product.route.js";
import { authRouter } from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./config/passport.js";

const app = express();

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
  }),
);

app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/search", searchRouter);
app.use("/api/products", productRouter);

app.use(errorHandler);
export default app;
