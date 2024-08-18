import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(`Database connected sucessfully`);
  } catch (error) {
    console.error(`Database connection failed ${error.message}`);
  }
};
export default databaseConnection;
