import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

/**
 * Middleware to verify JWT token from cookies
 * Validates authentication and attaches user data to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.access_token;

    // Check if token exists
    if (!token) {
        return next(errorHandler(401, "Authentication required."));
    }

    // Verify token validity
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token expired or invalid
            return next(errorHandler(403, "Invalid or expired token."));
        }

        // Attach user data to request object for downstream middleware/controllers
        req.user = decoded; // Contains { id, iat, exp }
        next();
    });
};