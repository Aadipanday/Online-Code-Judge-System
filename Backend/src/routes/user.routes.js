import { Router } from "express"

import {
    registerController,
    loginController,
    logoutController,
    getCurrentUser,
    refreshAccessToken
} from "../controllers/user.controllers.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/register").post(registerController);
router.route("/login").post(loginController)
router.route("/logout").post(verifyJWT, logoutController)
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/refresh-token").post(refreshAccessToken);


export default router;