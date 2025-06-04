process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/prismaClient.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 4000;

connectDB().then(() =>
    app.listen(PORT, () => {
        console.log(`App is listening on http://localhost:${PORT}`);
    })
);
