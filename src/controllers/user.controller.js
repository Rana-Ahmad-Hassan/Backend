import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import cloudUpload from "../utils/cloudinary.js";

const registerUser = AsyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;

    if ([userName, email, fullName, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { userName }]
    });

    if (existedUser) {
        throw new ApiError(409, "User is already existed");
    }

    const avatarLocalPath = req.files?.image[0].path;
    const coverImgLocalPath = req.files?.coverImage[0].path;
    
    if (!avatarLocalPath) {
        throw new ApiError(404, "Avatar image is required");
    }


    const avatar = await cloudUpload(`${avatarLocalPath}`);
    const coverImage = await cloudUpload(`${coverImgLocalPath}`);
    

    if (!avatar) {
        throw new ApiError(400, "Error uploading avatar image");
    }

    const newUser = await User.create({
        userName: userName.toLowerCase(),
        password,
        avatar: avatar.url,
        coveredImage: coverImage?.url || "",
        email,
        fullName,
    });

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

export { registerUser };
