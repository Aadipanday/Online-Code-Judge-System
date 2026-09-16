import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique:true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default : "user"
    },
    solvedProblem: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem"
        }

    ]

},
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema);