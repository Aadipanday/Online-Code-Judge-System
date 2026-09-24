import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Problem } from "../models/problem.models.js";
import { Submission } from "../models/submission.models.js";
import { submissionQueue } from "../queues/submission.queue.js";

const createSubmission = asyncHandler(async (req, res) => {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
        throw new ApiError(
            400,
            "Problem ID, code and language are required"
        );
    }

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem ID");
    }

    const allowedLanguages = ["javascript", "python", "cpp", "java"];
    if (!allowedLanguages.includes(language)) {
        throw new ApiError(400, `Language must be one of: ${allowedLanguages.join(", ")}`);
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

    await submissionQueue.add("code-submission", {
        submissionId: submission._id.toString()
    });

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

const getSubmissionById = asyncHandler(async (req, res) => {
    const { submissionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
        throw new ApiError(400, "Invalid submission ID");
    }

    const submission = await Submission.findById(submissionId).populate("problem", "title difficulty");

    if (!submission) {
        throw new ApiError(404, "Submission not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                submission,
                "Submission fetched successfully"
            )
        );
});

const getMySubmissions = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const totalSubmissions = await Submission.countDocuments({ user: req.user._id });
    const submissions = await Submission.find({ user: req.user._id })
        .populate("problem", "title difficulty")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                submissions,
                pagination: {
                    totalSubmissions,
                    totalPages: Math.ceil(totalSubmissions / limit),
                    currentPage: page,
                    limit
                }
            },
            "User submissions fetched successfully"
        )
    );
});

const getProblemSubmissions = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem ID");
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const totalSubmissions = await Submission.countDocuments({ problem: problemId });
    const submissions = await Submission.find({ problem: problemId })
        .populate("user", "username")
        .populate("problem", "title difficulty")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                submissions,
                pagination: {
                    totalSubmissions,
                    totalPages: Math.ceil(totalSubmissions / limit),
                    currentPage: page,
                    limit
                }
            },
            "Problem submissions fetched successfully"
        )
    );
});

export {
    createSubmission,
    getSubmissionById,
    getMySubmissions,
    getProblemSubmissions
};