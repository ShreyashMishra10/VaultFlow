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


/**
 * - GET /api/accounts
 * - Get all accounts of the logged-in user
 * - Protected Route
 */

router.get("/", authMiddlware.authMiddleware, accountController.getUserAccountsController)


/**
 * - GET /api/account/balance/:accountId
 */

router.get("/balance/:accountId", authMiddlware.authMiddleware, accountController.getAccountBalanceController)

module.exports = router