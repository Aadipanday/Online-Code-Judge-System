import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true
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
    refreshToken: {
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
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


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.method.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },

        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userSchema.method.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,

        },

        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}



export const User = mongoose.model("User", userSchema);