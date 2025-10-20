import express from "express";
import { test, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

/**
 * User Routes
 */

// Test endpoint (public)
router.get("/", test);

// Update user profile (protected)
router.put("/update/:id", verifyToken, updateUser);

// Delete user account (protected)
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;