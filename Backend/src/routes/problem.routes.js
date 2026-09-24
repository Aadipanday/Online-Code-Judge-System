import { Router } from "express"
import { roleCheck, verifyJWT } from "../middlewares/auth.middleware.js";
import { createProblemController, deleteProblem, getAllProblems, getProblemById, updateProblem } from "../controllers/problem.controller.js";


const router = Router();

router.route("/")
    .get(getAllProblems)
    .post(verifyJWT, roleCheck, createProblemController);

router.route("/create").post(verifyJWT, roleCheck, createProblemController);
router.route("/getAll").get(getAllProblems);
router.route("/:problemId").get(getProblemById);
router.route("/:problemId").patch(verifyJWT,roleCheck,updateProblem)
router.route("/:problemId").delete(
    verifyJWT,
    roleCheck,
    deleteProblem
);

export default router;