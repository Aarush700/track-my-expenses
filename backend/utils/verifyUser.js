// backend/utils/verifyUser.js
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

    if (!token) {
        return next(errorHandler(401, "Authentication required."));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT Verification Error:", err.message); // Debug
            return next(errorHandler(403, "Invalid or expired token."));
        }

        console.log("Decoded Token Payload:", decoded); // Debug
        if (!decoded.id) {
            return next(errorHandler(403, "Token missing user ID."));
        }

        req.user = { id: decoded.id.toString() }; // Ensure id is a string
        next();
    });
};