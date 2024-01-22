import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import fileUploadCloudinary from "../utils/cloudinary.js";

const registerUser = AsyncHandler(async (req, res) => {
   
    const { userName, email, fullName, password } = req.body;


    if (
        [userName, email, fullName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All the fields are require")
    }


    const existedUser = await User.findOne(
        {
            $or: [{ email }, { userName }]
        }
    )

    if (existedUser) {
        throw new ApiError(409, "User is already existed")
    }

    const avatarLocalPath = req.files?.avatar[0].path;
    const coverImgLocalPath = req.files?.coverImage[0].path;


    if (!avatarLocalPath) {
        throw new ApiError(404, "Avatar image is required")
    }

    const avatar = await fileUploadCloudinary(avatarLocalPath);
    const coverImage = await fileUploadCloudinary(coverImgLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar image file is required")
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        password,
        avatar: avatar.url,
        coveredImage: coverImage?.url || "",
        email,
        fullName,
    })

    const createdUser = await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong white the regestring the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )

    


})


export { registerUser }