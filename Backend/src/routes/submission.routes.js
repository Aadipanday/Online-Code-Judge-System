import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createSubmission } from "../controllers/submission.controller.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createSubmission
);

export default router;