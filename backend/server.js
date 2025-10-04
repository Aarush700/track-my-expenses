import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CRITICAL FIX 1: CORS must be configured BEFORE other middleware
app.use(cors({
    origin: "http://localhost:5173", // Your React app URL (Vite default)
    credentials: true, // CRITICAL: Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Now apply other middleware
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many requests, please try again later."
    }
}));

// Debug middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url} - Cookies:`, req.cookies);
    next();
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUri) {
    console.error("❌ MONGODB_URI is not defined in .env file");
    process.exit(1);
}
if (!jwtSecret) {
    console.error("❌ JWT_SECRET is not defined in .env file");
    process.exit(1);
}

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authentication API is running"
    });
});

// Error handlers
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});