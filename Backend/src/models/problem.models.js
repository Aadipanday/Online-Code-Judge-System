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
    }
       
    
},
{
    timestamps: true
})

export const Problem = mongoose.model("Problem", problemSchema);