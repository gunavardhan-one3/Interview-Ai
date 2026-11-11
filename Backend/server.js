require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

async function startServer() {
    const requiredEnv = ["MONGO_URI", "JWT_SECRET", "GOOGLE_GENAI_API_KEY"];
    const missingEnv = requiredEnv.filter((key) => !process.env[key]);
    if (missingEnv.length) {
        throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
    }
    if (process.env.JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET must contain at least 32 characters.");
    }

    await connectToDB();
    const port = Number(process.env.PORT) || 3000;
    const server = app.listen(port, "0.0.0.0", () => {
        console.log(`Server listening on port ${port}`);
    });

    const shutdown = (signal) => {
        console.log(`${signal} received. Shutting down.`);
        server.close(() => {
            const mongoose = require("mongoose");
            mongoose.disconnect().finally(() => process.exit(0));
        });
    };
    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});
