import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: 'dkvebyr7b',
    api_key: '497653187961171',
    api_secret: 'z8GaE2TH4Vf5HM3t5G2UUO_yHuk'
});



const cloudUpload = async (file) => {
    try {
        if (!file) {
            console.error('Files are required');
            return null;
        }

        const response = await cloudinary.uploader.upload(file);

        console.log('File is uploaded successfully', response.url);

        return response.url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error.message);
        fs.unlinkSync(file);
        throw new Error('Error uploading to Cloudinary');
    }
};

export default cloudUpload
