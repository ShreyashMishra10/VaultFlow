const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model");
const accountModel = require("../models/account.model");

/**
 * - POST /api/auth/register
 */ 
async function userRegisterController(req, res) {
    try {
        const { email, name, password } = req.body;

        const isExists = await userModel.findOne({ email });

        if (isExists) {
            return res.status(400).json({ 
                message: "User already exists",
                status: "failed"
            });
        }

        const user = await userModel.create({ email, name, password });

        // Automatically create a default ACTIVE account for the user
        const account = await accountModel.create({
            user: user._id,
            status: "ACTIVE"
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("token", token);

        // Safely attempt email sending without throwing a 500 error if it fails
        if (emailService && typeof emailService.sendRegistrationEmail === 'function') {
            await emailService.sendRegistrationEmail(user.email, user.name).catch(err => {
                console.error("Failed to send welcome email:", err.message);
            });
        }

        // Send HTTP response with token and account details
        return res.status(201).json({ 
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            account,
            token
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: error.message || "Registration failed on server" });
    }
}

/**
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Email or password might be invalid" });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Email or password might be invalid" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("token", token);

        return res.status(200).json({ 
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: error.message || "Login failed on server" });
    }
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ];

        if (!token) {
            return res.status(200).json({
                message: "User logged out successfully" 
            });
        }

        await tokenBlackListModel.create({ token });
        res.clearCookie("token");

        return res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: error.message || "Logout failed" });
    }
}

module.exports = { 
    userRegisterController, 
    userLoginController,
    userLogoutController
};