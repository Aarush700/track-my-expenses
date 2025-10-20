import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

/**
 * Test endpoint to verify API is working
 * @route GET /api/user/
 */

export const test = (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working!"
    });
};


/**
 * Update user profile information
 * @route PUT /api/user/update/:id
 * @access Private (requires authentication)
 */

export const updateUser = async (req, res, next) => {
    try {
        // Authorization check - users can only update their own account
        if (req.user.id !== req.params.id) {
            return next(errorHandler(403, "You can only update your own account."));
        }

        // Prepare update object with only provided fields
        const updateData = {};

        // Validate and sanitize username
        if (req.body.username) {
            const username = req.body.username.trim();
            if (username.length < 3) {
                return next(errorHandler(400, "Username must be at least 3 characters."));
            }
            updateData.username = username;
        }

        // Validate and sanitize email
        if (req.body.email) {
            const email = req.body.email.toLowerCase().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return next(errorHandler(400, "Invalid email format."));
            }
            updateData.email = email;
        }

        // Hash new password if provided
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return next(errorHandler(400, "Password must be at least 6 characters."));
            }
            updateData.password = bcryptjs.hashSync(req.body.password, 12);
        }

        // Update user with new fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            {
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        );

        if (!updatedUser) {
            return next(errorHandler(404, "User not found."));
        }

        // Exclude password from response
        const { password, ...userWithoutPassword } = updatedUser._doc;

        res.status(200).json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        // Handle duplicate key errors (username/email already exists)
        if (error.code === 11000) {
            return next(errorHandler(409, "Username or email already exists."));
        }
        next(errorHandler(500, "Server error. Please try again later."));
    }
};


/**
 * Delete user account permanently
 * @route DELETE /api/user/delete/:id
 * @access Private (requires authentication)
 */

export const deleteUser = async (req, res, next) => {
    try {
        // Authorization check - users can only delete their own account
        if (req.user.id !== req.params.id) {
            return next(errorHandler(403, "You can only delete your own account."));
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return next(errorHandler(404, "User not found."));
        }

        // Clear authentication cookie on account deletion
        res
            .clearCookie("access_token")
            .status(200)
            .json({
                success: true,
                message: "Account deleted successfully."
            });
    } catch (error) {
        next(errorHandler(500, "Server error. Please try again later."));
    }
};