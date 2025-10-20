import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
} from "../controllers/transaction.controller.js";

const router = express.Router();

/**
 * Transaction Routes
 */

// Get all transactions for the user
router.get("/", verifyToken, getTransactions);

// Create new transaction
router.post("/", verifyToken, createTransaction);

// Update transaction
router.put("/:id", verifyToken, updateTransaction);

// Delete transaction
router.delete("/:id", verifyToken, deleteTransaction);

// Get transaction statistics
router.get("/stats", verifyToken, getTransactionStats);

export default router;