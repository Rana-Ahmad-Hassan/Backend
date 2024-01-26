import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import AsyncHandler from "../utils/asyncHandler";
import User from "../models/user.model";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
    let token = req.cookies?.accessToken || req.header("Authorization");

    if (!token) {
        throw new ApiError(401, "Unauthorized user request");
    }

    if (token.startsWith("Bearer ")) {
        
        token = token.slice(7).trim();
    }

    try {
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid access token");
    }
});
