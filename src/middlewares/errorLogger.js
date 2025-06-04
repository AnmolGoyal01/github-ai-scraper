import logger from "../utils/logger.js";

export const errorLogger = (err, req, res, next) => {
    logger.error(`[❌ API ERROR] ${req.method} ${req.originalUrl} - ${err.message}`, err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};