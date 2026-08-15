import mongoose from "mongoose";
export async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected")
    }catch(error){
        console.log("MongoDb ERROR:", error);
        throw new Error("DB connected fail")
    }
}