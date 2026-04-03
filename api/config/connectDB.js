import { connect } from "mongoose";
import { AppError } from "../utils/appError.js";
const mongoConnect = async () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    if (!mongoUri)
      throw new AppError(
        "MONGO_URI is not defined in environment variables",
        500
      );

    await connect(mongoUri, {
      dbName: "biblo",
    });
    console.log("MongoDB connected successfully");
  } catch (e) {
    console.error(
      `MongoDB connection error:, ${e.message} status code: ${
        e.statusCode || 500
      }`
    );
  }
};
export default mongoConnect;
