import express from "express";
import { signup, signin, signout } from "../controllers/auth.controller.js";

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

export default router;