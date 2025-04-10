import mongoose from "mongoose";
import { DB_NAME } from "../../constent.js";

const ConnectDB = async () => {
    console.log(`${process.env.MONGODB_URL}/${DB_NAME}`)
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
