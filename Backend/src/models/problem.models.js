import mongoose, { Schema } from "mongoose"

const problemSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
},
    constraints: {
        type: String,
        required: true,
    },
    inputFormat: {
        type: String,
        required: true,
    },
    outputFormat: {
        type: String,
        required: true,
    },
    testCases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            },
            isHidden: {
                type: Boolean,
                default: true
            }
        }
    ],
    tags: {
        type: [String],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    timeLimit: {
        type: Number,
        default: 1000 // execution time limit in milliseconds
    },
    memoryLimit: {
        type: Number,
        default: 256 // memory limit in MB
    }
},
{
    timestamps: true
})

export const Problem = mongoose.model("Problem", problemSchema);