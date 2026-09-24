import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        code: {
            type: String,
            required: true
        },

        language: {
            type: String,
            enum: ["javascript", "python", "cpp", "java"],
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Running",
                "Accepted",
                "Wrong Answer",
                "Compilation Error",
                "Runtime Error",
                "Time Limit Exceeded"
            ],
            default: "Pending"
        },

        output: {
            type: String,
            default: null
        },

        error: {
            type: String,
            default: null
        },

        executionTime: {
            type: Number,
            default: null
        },

        memoryUsed: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: true
    }
);

submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, createdAt: -1 });

export const Submission = mongoose.model(
    "Submission",
    submissionSchema
);