import mongoose from "mongoose"


export const connection= async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`)
    } catch (error) {
        console.log("Unknown error is coming from data base",error);
        throw error;
    }
}