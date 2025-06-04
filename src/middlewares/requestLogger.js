import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const logMessage = `[${req.method}] ${req.originalUrl} - ${status} (${duration}ms)`;

        if (status >= 400) {
            logger.error(`[❌ API ERROR] ${logMessage}`);
        } else {
            logger.info(`[✅ API RESPONSE] ${logMessage}`);
        }
    });

    next();
};
