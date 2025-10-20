import express from "express";
import { submitContact } from "../controllers/contact.controller.js";

const router = express.Router();

/**
 * Contact Routes
 */

// Submit contact form
router.post("/", submitContact);

export default router;