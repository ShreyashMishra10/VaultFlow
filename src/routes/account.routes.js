const express = require("express")
const authMiddlware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */

router.post("/", authMiddlware.authMiddleware, accountController.createAccountController)

module.exports = router