import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import AsyncHandler from "../utils/asyncHandler.js";
import fileUpload from "../utils/cloudinary.js";

const registerUser = AsyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
    const { userName, email, fullName, password } = req.body;


    if (
        [userName, email, fullName,  password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All the fields are require")
    }


    const existedUser = User.findOne(
        {
            $or: [{ email }, { userName }]
        }
    )

    if(existedUser){
        throw new ApiError(409,"User is already existed")
    }

    const avatarLocalPath=req.files?.avatar[0].path;
    const coverImgLocalPath=req.files?.coverImage[0].path;


    if(!avatarLocalPath){
        throw new ApiError(404,"Avatar image is required")
    }

    const avatar= await fileUpload(avatarLocalPath);
    const coverImage= await fileUpload(coverImgLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar image file is required")
    }


})


export { registerUser }