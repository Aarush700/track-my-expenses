import mongoose from "mongoose";

/**
 * Transaction schema for income and expense tracking
 * Supports both income and expense with a 'type' field
 * Linked to user for personal tracking
 */

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create indexes for faster queries
transactionSchema.index({ userId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;