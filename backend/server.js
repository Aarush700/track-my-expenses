import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import contactRoutes from "./routes/contact.route.js";

dotenv.config();

// Application Insights for Azure monitoring
let appInsights;
if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    try {
        const ai = await import('applicationinsights');
        ai.default.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
            .setAutoDependencyCorrelation(true)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true, true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true)
            .setUseDiskRetryCaching(true)
            .setSendLiveMetrics(true)
            .start();
        appInsights = ai.default.defaultClient;
        console.log("📊 Application Insights monitoring enabled");
    } catch (error) {
        console.log("⚠️ Application Insights not available (optional in development)");
    }
}

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || true
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Security & Middleware
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Allow frontend assets
}));

// Rate limiting
app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many requests, please try again later."
    }
}));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);

        // Track custom metrics in Application Insights
        if (appInsights) {
            appInsights.trackRequest({
                name: `${req.method} ${req.url}`,
                url: req.url,
                duration: duration,
                resultCode: res.statusCode,
                success: res.statusCode < 400
            });
        }
    });
    next();
});

// Environment validation
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

// MongoDB connection + monitoring
mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        if (appInsights) {
            appInsights.trackEvent({ name: "MongoDB Connected" });
        }
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        if (appInsights) {
            appInsights.trackException({ exception: err });
        }
        process.exit(1);
    });

// Monitor MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
    if (appInsights) {
        appInsights.trackException({ exception: err });
    }
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/contact", contactRoutes);

// Health check endpoint (for Azure/monitoring)
app.get("/health", (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        environment: process.env.NODE_ENV || "development"
    };
    res.status(200).json(healthcheck);
});

// Metrics endpoint (simple performance stats)
app.get("/api/metrics", (req, res) => {
    const metrics = {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        timestamp: Date.now()
    };
    res.status(200).json(metrics);
});

// Serve static frontend files (production)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Catch-all route for SPA (must be after API routes)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Error handlers
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.stack);

    // Track errors in Application Insights
    if (appInsights) {
        appInsights.trackException({ exception: err });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message: process.env.NODE_ENV === "production"
            ? "An error occurred"
            : message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Route not found"
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});