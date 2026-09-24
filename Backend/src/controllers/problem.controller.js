import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Problem } from "../models/problem.models.js";

const createProblemController = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        difficulty,
        constraints,
        inputFormat,
        outputFormat,
        testCases,
        tags,
        timeLimit,
        memoryLimit
    } = req.body;

    if (
        [title, description, difficulty, constraints, inputFormat, outputFormat]
            .some((field) => !field?.trim())
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
        throw new ApiError(400, "Difficulty must be Easy, Medium, or Hard");
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
        throw new ApiError(400, "At least one test case is required");
    }

    const existedProblem = await Problem.findOne({ title });

    if (existedProblem) {
        throw new ApiError(409, "Problem already exists");
    }

    const problem = await Problem.create({
        title,
        description,
        difficulty,
        constraints,
        inputFormat,
        outputFormat,
        testCases,
        tags,
        timeLimit: timeLimit ? Number(timeLimit) : 1000,
        memoryLimit: memoryLimit ? Number(memoryLimit) : 256,
        author: req.user._id
    });

    if (!problem) {
        throw new ApiError(
            500,
            "Something went wrong while creating the problem"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                problem,
                "Problem created successfully"
            )
        );
});

const getAllProblems = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const { difficulty, tag, search } = req.query;

    const query = {};

    if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) {
        query.difficulty = difficulty;
    }

    if (tag) {
        query.tags = tag;
    }

    if (search?.trim()) {
        query.title = { $regex: search.trim(), $options: "i" };
    }

    const totalProblems = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
        .select("-testCases")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    problems,
                    pagination: {
                        totalProblems,
                        totalPages: Math.ceil(totalProblems / limit),
                        currentPage: page,
                        limit
                    }
                },
                "Problems fetched successfully"
            )
        );
});

const getProblemById = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem ID");
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new ApiError(404, "Problem is not found");
    }

    const isUserAdmin = req.user?.role === "admin";
    const problemData = problem.toObject();

    if (!isUserAdmin) {
        problemData.testCases = problemData.testCases.filter((tc) => !tc.isHidden);
    }

    return res.status(200)
        .json(new ApiResponse(200, problemData, "Problem fetched successfully"));
});

const updateProblem = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem ID");
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    const {
        title,
        description,
        difficulty,
        constraints,
        inputFormat,
        outputFormat,
        testCases,
        tags,
        timeLimit,
        memoryLimit
    } = req.body;

    if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) {
        throw new ApiError(400, "Difficulty must be Easy, Medium, or Hard");
    }

    problem.title = title || problem.title;
    problem.description = description || problem.description;
    problem.difficulty = difficulty || problem.difficulty;
    problem.constraints = constraints || problem.constraints;
    problem.inputFormat = inputFormat || problem.inputFormat;
    problem.outputFormat = outputFormat || problem.outputFormat;
    problem.testCases = testCases || problem.testCases;
    problem.tags = tags || problem.tags;
    if (timeLimit) problem.timeLimit = Number(timeLimit);
    if (memoryLimit) problem.memoryLimit = Number(memoryLimit);

    await problem.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                problem,
                "Problem updated successfully"
            )
        );
});

const deleteProblem = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new ApiError(400, "Invalid problem ID");
    }

    const problem = await Problem.findByIdAndDelete(problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Problem deleted successfully"
            )
        );
});


export {
    createProblemController,
    getAllProblems,
    getProblemById,
    updateProblem,
    deleteProblem,
}