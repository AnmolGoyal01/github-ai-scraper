import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
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


// request logger
app.use(requestLogger);

// swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// health check route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Server health check
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
});

// routes import
import scraperRoutes from "./routes/scraper.routes.js";

// routes declaration
app.use("/api/v1/scrape", scraperRoutes);

// error middlewares
app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

export default app;
