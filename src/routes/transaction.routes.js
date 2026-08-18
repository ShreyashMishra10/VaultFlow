const {Router} = require("express")
const authMiddleWare = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")
const transactionRoutes = Router();

/**
 * - POST /api/transaction
 * - Create a mew transaction
 */

transactionRoutes.post("/", authMiddleWare.authMiddleware, transactionController.createTransaction);


module.exports= transactionRoutes;