import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";
import fileUpload from "../utils/cloudinary.js";

const registerUser = AsyncHandler(async (req, res) => {
    // Always use return or res.end() after sending a response
    res.status(200).json({
        message: "ok"
    });

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

    const avatarLocalPath = req.files?.avatar[0].path;
    const coverImgLocalPath = req.files?.coverImage[0].path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await fileUpload(avatarLocalPath);
    const coverImage = coverImgLocalPath ? await fileUpload(coverImgLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Error uploading avatar image");
    }

    const newUser = new User({
        userName: userName.toLowerCase(),
        password,
        avatar: avatar.url,
        coveredImage: coverImage?.url || "",
        email,
        fullName,
    });

    const createdUser = await newUser.save();

    if (!createdUser) {
        throw new ApiError(500, "Error registering the user");
    }

   
    const responseData = {
        _id: createdUser._id,
        userName: createdUser.userName,
        avatar: createdUser.avatar,
        coveredImage: createdUser.coveredImage,
        email: createdUser.email,
        fullName: createdUser.fullName,
    };

    return res.status(201).json(
        new ApiResponse(200, responseData, "User registered successfully")
    );
});

export { registerUser };
