import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

export async function connectToMongoDB(){
    try{
        await mongoose.connect(
            MONGODB_URI,
            {dbName: DB_NAME} 
        );
        console.log("Connected to MongoDB");
        return mongoose;
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
    }
}

export async function disconnectFromMongoDB(){
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
}

