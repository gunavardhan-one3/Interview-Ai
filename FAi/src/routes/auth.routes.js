const express=require("express");
const authRouter = express.Router();
const authController=require("../controllers/auth.controller"); 
/**
*@route POST /api/auth/register
*@description Resgister a new user
*@access Public
*/
authRouter.post("/register",authController.registerUserController);
/**
 * @route POST /api/auth/login
 * @description login a user with email and password
 * @access public
 */
authRouter.post("/login",authController.loginUserController);
module.exports=authRouter;