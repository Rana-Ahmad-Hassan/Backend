import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
console.log(process.env.API_SECRET)

const fileUpload = async (file) => {
    try {
        if (!file) return null
        const response = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        })
        console.log("File is uploaded successfully", response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(file)
        return null;
    }
}

export default fileUpload