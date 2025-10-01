import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

// Load environment variables from .env file in the root directory
dotenv.config();

// Initialize Express application
const app = express();

// Define port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware: Parse JSON request bodies with a size limit for security
app.use(express.json({ limit: '10kb' }));

// Middleware: Parse cookies for authentication tokens
app.use(cookieParser());

// Middleware: Set security HTTP headers to protect against common vulnerabilities
app.use(helmet());

// Middleware: Enable CORS for cross-origin requests (configure origin for production)
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://localhost:5173'
        : 'http://localhost:3000',
    credentials: true // Allow cookies to be sent with requests
}));

// Middleware: Apply rate limiting to prevent brute-force attacks
app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: 100, // Max 100 requests per IP
    message: {
        success: false,
        statusCode: 429,
        message: 'Too many requests, please try again later.'
    }
}));

// Connect to MongoDB using the URI from environment variables
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// Routes: Mount API routes for user and authentication endpoints
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Root route: Simple health check for the API
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authentication API is running'
    });
});

// Global Error Handler: Catch and format all errors for consistent API responses
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack); // Log full error stack for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

// 404 Handler: Handle requests to undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Route not found'
    });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});