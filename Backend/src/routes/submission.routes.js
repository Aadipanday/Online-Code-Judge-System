import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createSubmission,
    getSubmissionById,
    getMySubmissions,
    getProblemSubmissions
} from "../controllers/submission.controller.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createSubmission
);

router.route("/my-submissions").get(
    verifyJWT,
    getMySubmissions
);

router.route("/problem/:problemId").get(
    verifyJWT,
    getProblemSubmissions
);

router.route("/:submissionId").get(
    verifyJWT,
    getSubmissionById
);

export default router;