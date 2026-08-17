const accountModel = require("../models/account.model");

async function createAccountController(req, res) { // <-- Changed from (res, req) to (req, res)
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized: User not found on request"
        });
    }

    const account = await accountModel.create({
        user: user._id
    });

    return res.status(201).json({
        account
    });
}

module.exports = {
    createAccountController
};