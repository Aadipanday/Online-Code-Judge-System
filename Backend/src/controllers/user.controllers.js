import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js";


const generateAccessAndRefreshToken = async function (userOrId) {
    const user = typeof userOrId === "object" && userOrId !== null && userOrId._id
        ? userOrId
        : await User.findById(userOrId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};


const registerController = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim() || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const trimmedUsername = username.toLowerCase().trim();
    const trimmedEmail = email.toLowerCase().trim();

    const existedUser = await User.findOne({
        $or: [{ username: trimmedUsername }, { email: trimmedEmail }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
        username: trimmedUsername,
        email: trimmedEmail,
        password
    });

    const createdUser = await User.findById(user?._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201)
        .json(new ApiResponse(201, createdUser, "User created successfully!"));
});

const loginController = asyncHandler(async (req, res) => {
    // get username or email and password from frontend
    // validate it 
    // find the user in db
    // verify the password
    // generate refreshtoken and accesstoken 
    // set cookies
    // return res

    const { username, email, password } = req.body;

    if (!(username || email) || !password) {
        throw new ApiError(400, "Username or email and password are required");
    }

    const user = await User.findOne({
        $or: [
            ...(username ? [{ username: username.toLowerCase().trim() }] : []),
            ...(email ? [{ email: email.toLowerCase().trim() }] : [])
        ]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    // console.log(typeof user.isPasswordCorrect);
    // console.log("heloojfasldhj")

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );

});

const logoutController = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request: refresh token is missing");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or already used");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export {
    registerController,
    registerController as registerContoller,
    loginController,
    logoutController,
    getCurrentUser,
    refreshAccessToken
};