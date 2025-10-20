import mongoose from "mongoose";

/**
 * Contact submission schema for storing user inquiries
 */

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
            minlength: [3, "Subject must be at least 3 characters"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [10, "Message must be at least 10 characters"],
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Create index for faster email lookups
contactSchema.index({ email: 1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;