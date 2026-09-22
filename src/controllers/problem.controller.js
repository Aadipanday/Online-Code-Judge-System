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
        tags
    } = req.body;

    if (
        [title, description, difficulty, constraints, inputFormat, outputFormat]
            .some((field) => !field?.trim())
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if (!testCases || !testCases.length) {
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
    const problems = await Problem.find({});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                problems,
                "Problems fetched successfully"
            )
        );
});

const getProblemById = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new ApiError(404, " Problem is not found ")
    }
    return res.status(200)
        .json(new ApiResponse(200, problem, "problem fetched successfully"))
})

const updateProblem = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

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
        tags
    } = req.body;

    problem.title = title || problem.title;
    problem.description = description || problem.description;
    problem.difficulty = difficulty || problem.difficulty;
    problem.constraints = constraints || problem.constraints;
    problem.inputFormat = inputFormat || problem.inputFormat;
    problem.outputFormat = outputFormat || problem.outputFormat;
    problem.testCases = testCases || problem.testCases;
    problem.tags = tags || problem.tags;

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

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    await Problem.findByIdAndDelete(problemId);

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