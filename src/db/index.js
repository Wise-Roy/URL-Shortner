import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL environment variable is not defined");
    process.exit(1);
  }

  try {
    const connectInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${connectInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export { connectDB };
