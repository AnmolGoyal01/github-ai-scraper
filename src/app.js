import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
    errorHandler,
    notFound,
    requestLogger,
    errorLogger,
} from "./middlewares/index.js";
const app = express();

// config cors,json,cookieParser,etc
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// health check route
app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
});

// request logger
app.use(requestLogger);

// routes import
import scraperRoutes from "./routes/scraper.routes.js";

// routes declaration
app.use("/api/v1/scrape", scraperRoutes);

// error middlewares
app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

export default app;
