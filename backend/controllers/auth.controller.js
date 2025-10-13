import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

/**
 * Register a new user
 * @route POST /api/auth/signup
 */

export const signup = async (req, res, next) => {
    try {
        const { username, email, password, securityQuestion, securityAnswer } = req.body;

        // Input validation
        if (!username || !email || !password || !securityQuestion || !securityAnswer) {
            return next(errorHandler(400, "All fields are required."));
        }

        if (password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters."));
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return next(errorHandler(409, "Username or email already exists."));
        }

        const hashedPassword = bcryptjs.hashSync(password, 12);

        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            securityQuestion,
            securityAnswer: securityAnswer.trim().toLowerCase(),
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully!"
        });
    } catch (error) {
        if (error.code === 11000) {
            return next(errorHandler(409, "Username or email already exists."));
        }
        next(errorHandler(500, "Server error. Please try again later."));
    }
};


/**
 * Authenticate user and generate JWT token
 * @route POST /api/auth/signin
 */

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return next(errorHandler(400, "Email and password are required."));
        }

        // Find user by email
        const validUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (!validUser) {
            return next(errorHandler(401, "Invalid credentials."));
        }

        // Verify password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid credentials."));
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Extended to 7 days for better UX
        );

        // Remove password from response
        const { password: hashedPassword, ...userWithoutPassword } = validUser._doc;

        // Set secure HTTP-only cookie
        res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // HTTPS only in production
                sameSite: "strict", // CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .status(200)
            .json({
                success: true,
                user: userWithoutPassword
            });
    } catch (error) {
        next(errorHandler(500, "Server error. Please try again later."));
    }
};


/**
 * Reset user password using security question
 * @route POST /api/auth/forgot-password
 */

export const forgotPassword = async (req, res, next) => {
    try {
        const { email, securityQuestion, securityAnswer, newPassword } = req.body;

        // Input validation
        if (!email || !securityQuestion || !securityAnswer || !newPassword) {
            return next(errorHandler(400, "All fields are required."));
        }

        if (newPassword.length < 6) {
            return next(errorHandler(400, "New password must be at least 6 characters."));
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return next(errorHandler(404, "User not found."));
        }

        // Verify security answer (case-insensitive)
        if (user.securityQuestion !== securityQuestion || user.securityAnswer !== securityAnswer.toLowerCase().trim()) {
            return next(errorHandler(401, "Incorrect security question or answer."));
        }

        // Hash new password
        const hashedPassword = bcryptjs.hashSync(newPassword, 12);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. Please sign in with your new password."
        });
    } catch (error) {
        next(errorHandler(500, "Server error. Please try again later."));
    }
};


/**
 * Sign out user by clearing authentication cookie
 * @route GET /api/auth/signout
 */

export const signout = (req, res) => {
    res
        .clearCookie("access_token")
        .status(200)
        .json({
            success: true,
            message: "Signed out successfully."
        });
};