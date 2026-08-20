const {Router} = require("express")
const authMiddleWare = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")
const transactionRoutes = Router();

/**
 * - POST /api/transaction
 * - Create a mew transaction
 */

transactionRoutes.post("/", authMiddleWare.authMiddleware, transactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user 
 */

transactionRoutes.post("/system/initial-funds", authMiddleWare.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)
module.exports= transactionRoutes;