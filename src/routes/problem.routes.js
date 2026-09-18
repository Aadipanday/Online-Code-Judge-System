import { Router } from "express"
import { roleCheck, verifyJWT } from "../middlewares/auth.middleware.js";
import { createProblemController, getAllProblems } from "../controllers/problem.controller.js";


const router = Router();

router.route("/create").post(verifyJWT,roleCheck,createProblemController)
router.route("/getAll").get(getAllProblems)

export default router;