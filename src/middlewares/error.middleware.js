import { ApiError } from "../utils/index.js";

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err instanceof ApiError) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors: err.errors || [],
            data: null,
        });
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors: [{ message }],
        data: null,
    });
};
