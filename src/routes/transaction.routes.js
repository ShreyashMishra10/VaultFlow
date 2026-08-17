const {Router} = require("express")
const authMiddleWare = require("../middleware/auth.middleware")

const transactionRoutes = Router();

/**
 * - POST /api/transaction
 * - Create a mew transaction
 */

transactionRoutes.post("/", authMiddleWare.authMiddleware);


module.exports= transactionRoutes;