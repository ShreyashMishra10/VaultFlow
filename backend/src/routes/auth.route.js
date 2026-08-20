const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

/* POST /api/auth/register */
router.post("/register", authController.userRegisterController);

/* POSt /api/auth/login */
router.post("/login", authController.userLoginController)

/**
 * - POST /api/auth/logout
 */

router.post("/logout", authController.userLogoutController)

module.exports = router;