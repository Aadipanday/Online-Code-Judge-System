import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"

const generateAccessAndRefreshToken = async function(userId){
    const user = await User.findById(userId);
    const accessToken =  user.generateAccessToken();
    const refreshToken =  user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken,refreshToken}

}


const registerContoller = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user?._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201)
        .json(new ApiResponse(201, createdUser, "user created successfully!!"))
})

const loginController = asyncHandler(async(req,res) => {
    // get username or email and password from frontend
    // validate it 
    // find the user in db
    // verify the password
    // generate refreshtoken and accesstoken 
    // set cookies
    // return res

    const { username, email, password } = req.body;

    if(!(username || email) || !password){
         throw new ApiError(400, "Username or email and password are required");
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
            .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

export {
    registerContoller
}