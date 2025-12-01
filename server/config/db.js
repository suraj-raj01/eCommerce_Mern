import mongoose from "mongoose";
// require("@dotenvx/dotenvx").config();
const Database = process.env.DATABASE_URL;
const connectDB = async () => {
    try {
        mongoose
            .connect(Database, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log("✅ Database Connected Successfully!"))
            .catch((err) => console.error("❌ Database connection failed:", err.message));
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
