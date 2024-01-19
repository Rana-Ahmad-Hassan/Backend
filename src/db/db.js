import mongoose from "mongoose";

export const connection = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log("Connected to MongoDB!!!!!!:", connectionInstance.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};
