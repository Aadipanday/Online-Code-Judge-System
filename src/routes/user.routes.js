import { Router } from "express"

import {
    registerContoller,
    loginController,
    logoutController
} from "../controllers/user.controllers.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/register").post(registerContoller);
router.route("/login").post(loginController)
router.route("/logout").post(verifyJWT,logoutController)


export default router;