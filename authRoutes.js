const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ✅ Register API
router.post("/register", async (req, res) => {
    console.log("🔹 Received registration request:", req.body); // Debugging log

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.json({ message: "✅ User registered successfully", username: newUser.username });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
