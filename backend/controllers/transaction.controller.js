import Transaction from "../models/transaction.model.js";
import { errorHandler } from "../utils/error.js";

/**
 * Get all transactions for the logged-in user
 * @route GET /api/transactions
 * @access Private
 */

export const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        next(errorHandler(500, "Server error. Please try again."));
    }
};


/**
 * Create a new transaction (income or expense)
 * @route POST /api/transactions
 * @access Private
 */

export const createTransaction = async (req, res, next) => {
    try {
        const { type, category, amount, date, description } = req.body;

        if (!type || !category || !amount || !date) {
            return next(errorHandler(400, "Type, category, amount, and date are required."));
        }

        if (!["income", "expense"].includes(type)) {
            return next(errorHandler(400, "Invalid type. Must be 'income' or 'expense'."));
        }

        if (amount <= 0) {
            return next(errorHandler(400, "Amount must be positive."));
        }

        const newTransaction = new Transaction({
            userId: req.user.id,
            type,
            category: category.trim(),
            amount,
            date: new Date(date),
            description: description?.trim(),
        });

        await newTransaction.save();

        res.status(201).json({
            success: true,
            transaction: newTransaction,
        });
    } catch (error) {
        next(errorHandler(500, "Server error. Please try again."));
    }
};


/**
 * Update a transaction
 * @route PUT /api/transactions/:id
 * @access Private
 */

export const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return next(errorHandler(404, "Transaction not found."));
        }

        if (transaction.userId.toString() !== req.user.id) {
            return next(errorHandler(403, "You can only update your own transactions."));
        }

        const updateData = {};

        if (req.body.type) {
            if (!["income", "expense"].includes(req.body.type)) {
                return next(errorHandler(400, "Invalid type. Must be 'income' or 'expense'."));
            }
            updateData.type = req.body.type;
        }

        if (req.body.category) {
            updateData.category = req.body.category.trim();
        }

        if (req.body.amount) {
            if (req.body.amount <= 0) {
                return next(errorHandler(400, "Amount must be positive."));
            }
            updateData.amount = req.body.amount;
        }

        if (req.body.date) {
            updateData.date = new Date(req.body.date);
        }

        if (req.body.description) {
            updateData.description = req.body.description.trim();
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            transaction: updatedTransaction,
        });
    } catch (error) {
        next(errorHandler(500, "Server error. Please try again."));
    }
};


/**
 * Delete a transaction
 * @route DELETE /api/transactions/:id
 * @access Private
 */

export const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return next(errorHandler(404, "Transaction not found."));
        }

        if (transaction.userId.toString() !== req.user.id) {
            return next(errorHandler(403, "You can only delete your own transactions."));
        }

        await Transaction.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully.",
        });
    } catch (error) {
        next(errorHandler(500, "Server error. Please try again."));
    }
};


/**
 * Get summary statistics for the user's transactions
 * @route GET /api/transactions/stats
 * @access Private
 */

export const getTransactionStats = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });

        let totalIncome = 0;
        let totalExpense = 0;
        const categorySummary = {};

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }

            if (!categorySummary[transaction.category]) {
                categorySummary[transaction.category] = 0;
            }
            categorySummary[transaction.category] += transaction.amount;
        });

        const balance = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            totalIncome,
            totalExpense,
            balance,
            categorySummary,
            transactionCount: transactions.length,
        });
    } catch (error) {
        next(errorHandler(500, "Server error. Please try again."));
    }
};