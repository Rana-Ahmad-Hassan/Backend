import { Router } from "express";
import {  registerUser } from "../controllers/user.controller.js";
import { uploadFile } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/reg").post(
    uploadFile.fields([
        {
            name:"coverImage",
            maxCount:1
        },
        {
            name:"image",
            maxCount:1
        }
    ]),
    registerUser)


export default router;