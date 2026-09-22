import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Problem } from "../models/problem.models.js";
import { Submission } from "../models/submission.models.js";

const createSubmission = asyncHandler(async (req, res) => {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
        throw new ApiError(
            400,
            "Problem ID, code and language are required"
        );
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    const submission = await Submission.create({
        user: req.user._id,
        problem: problemId,
        code,
        language
    });

    if (!submission) {
        throw new ApiError(
            500,
            "Something went wrong while creating submission"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                submission,
                "Code submitted successfully"
            )
        );
});

export { createSubmission };