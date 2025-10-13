import express from "express";
import { signup, signin, signout, forgotPassword } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * Authentication Routes
 */

// Register new user account
router.post("/signup", signup);

// Login existing user
router.post("/signin", signin);

// Logout user
router.get("/signout", signout);

// Forgot password
router.post("/forgot-password", forgotPassword);

export default router;