const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const sendRegistrationEmail = require("../services/email.service");

/**
 * - POST /api/auth/register
 */ 
async function userRegisterController(req, res) {
    const { email, name, password } = req.body;

    const isExists = await userModel.findOne({ email });

    if (isExists) {
        return res.status(400).json({ 
            message: "User already exists",
            status: "failed"
        });
    }

    const user = await userModel.create({ email, name, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
    res.cookie("token", token);

    
    
    await sendRegistrationEmail(user.email, user.name);
        

    // Send HTTP response
    return res.status(201).json({ 
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}

/**
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
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
}

module.exports = { 
    userRegisterController, 
    userLoginController 
};