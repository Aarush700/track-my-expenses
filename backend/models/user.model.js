import mongoose from "mongoose";

/**
 * User schema definition
 * Stores user account information with automatic timestamps
 */

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address"
            ]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },
        securityQuestion: {
            type: String,
            required: true,
            enum: ["Whats your favorite color?", "Whats your pets name?", "Whats your first school?"],
        },
        profilePicture: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

const User = mongoose.model("User", userSchema);

export default User;