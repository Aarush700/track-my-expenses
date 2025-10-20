import Contact from "../models/contact.model.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";

/**
 * Get or create email transporter (lazy initialization)
 * This ensures environment variables are loaded before creating the transporter
 */

let transporterInstance = null;
let transporterChecked = false;

const getTransporter = () => {
    // Return cached result if already checked
    if (transporterChecked) {
        return transporterInstance;
    }

    const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS } = process.env;

    // Mark as checked to avoid repeated logs
    transporterChecked = true;

    // Validate credentials exist
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.warn("\n⚠️  Email credentials missing. Email notifications will be disabled.");
        console.warn(`   EMAIL_SERVICE: ${EMAIL_SERVICE || '❌ NOT SET'}`);
        console.warn(`   EMAIL_USER: ${EMAIL_USER || '❌ NOT SET'}`);
        console.warn(`   EMAIL_PASS: ${EMAIL_PASS ? '✅ SET' : '❌ NOT SET'}\n`);
        transporterInstance = null;
        return null;
    }

    try {
        // Create transporter
        transporterInstance = nodemailer.createTransport({
            service: EMAIL_SERVICE || "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        console.log(`\n✅ Email transporter configured successfully!`);
        console.log(`   Service: ${EMAIL_SERVICE || 'gmail'}`);
        console.log(`   User: ${EMAIL_USER}\n`);

        return transporterInstance;
    } catch (error) {
        console.error("❌ Failed to create email transporter:", error.message);
        transporterInstance = null;
        return null;
    }
};


/**
 * Submit a new contact form
 * @route POST /api/contact
 */

export const submitContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return next(errorHandler(400, "All fields are required."));
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return next(errorHandler(400, "Please provide a valid email address."));
        }

        // Create new contact document
        const newContact = new Contact({
            name,
            email,
            subject,
            message,
        });

        await newContact.save();
        console.log("✅ Contact saved successfully:", newContact._id);

        // Get transporter (lazy initialization)
        const transporter = getTransporter();

        // Send email notification (only if transporter is configured)
        if (transporter) {
            try {
                const mailOptions = {
                    from: `"${name}" <${process.env.EMAIL_USER}>`,
                    to: process.env.EMAIL_USER,
                    replyTo: email,
                    subject: `📬 New Contact Form: ${subject}`,
                    text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
                    `,
                    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h2 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
        .field:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .value { font-size: 16px; color: #333; }
        .message-box { background: #f9fafb; padding: 20px; border-left: 4px solid #667eea; margin-top: 10px; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f9fafb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📬 New Contact Form Submission</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From</div>
                <div class="value">${name}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></div>
            </div>
            <div class="field">
                <div class="label">Subject</div>
                <div class="value">${subject}</div>
            </div>
            <div class="field">
                <div class="label">Message</div>
                <div class="message-box">
                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
            </div>
        </div>
        <div class="footer">
            Submitted at ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log("✅ Email notification sent successfully");
            } catch (emailError) {
                console.error("❌ Email sending failed:", emailError.message);
                // Don't fail the entire request if email fails
                // Contact is already saved to database
            }
        } else {
            console.log("ℹ️  Email notifications disabled - credentials not configured");
        }

        res.status(201).json({
            success: true,
            message: "Thank you for your submission! We will get back to you soon.",
            data: {
                id: newContact._id,
                submittedAt: newContact.createdAt,
            },
        });
    } catch (error) {
        console.error("❌ SubmitContact Error:", error);

        // Handle duplicate submission
        if (error.code === 11000) {
            return next(errorHandler(409, "A similar submission already exists."));
        }

        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return next(errorHandler(400, messages.join(". ")));
        }

        next(errorHandler(500, "Server error. Please try again later."));
    }
};


/**
 * Get all contact submissions (admin only)
 * @route GET /api/contact
 */

export const getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .select("-__v");

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error) {
        console.error("❌ GetContacts Error:", error);
        next(errorHandler(500, "Failed to retrieve contacts."));
    }
};