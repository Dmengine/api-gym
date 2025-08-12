import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI as string)
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
    }
}