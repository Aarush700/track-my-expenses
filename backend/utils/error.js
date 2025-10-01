/**
 * Creates a standardized error object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {Error} Custom error object with statusCode property
 */

export const errorHandler = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};