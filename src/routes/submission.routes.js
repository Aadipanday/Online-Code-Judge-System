import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createSubmission } from "../controllers/submission.controllers.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createSubmission
);

export default router;