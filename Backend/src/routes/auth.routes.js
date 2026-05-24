const express=require("express");
const authRouter = express.Router();
const authController=require("../controllers/auth.controller"); 
const authMiddleware=require("../middlewares/auth.middleware");
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
/**
 * @route GET /api/auth/logout
 *@description clear token from user cookie and add the token in the blacklist 
* @access private
*/
authRouter.get("/logout",authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController);

module.exports=authRouter;