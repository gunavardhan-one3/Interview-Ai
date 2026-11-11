const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://interview-ai-tan-mu.vercel.app",
    ...(process.env.FRONTEND_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
];

app.disable("x-powered-by");
app.use(cors({
    origin(origin, callback) {
        // Allow requests without an Origin header (e.g. server-to-server).
        if (!origin) return callback(null, true);

        // Allow explicitly configured frontend domains.
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/interview", require("./routes/interview.routes"));
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

app.use((err, _req, res, _next) => {
    console.error("Request error:", err.message);
    if (err.name === "MulterError") {
        const message = err.code === "LIMIT_FILE_SIZE" ? "Resume must be 3 MB or smaller." : err.message;
        return res.status(400).json({ message });
    }
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    if (err.code === 11000) return res.status(409).json({ message: "A user with this username or email already exists." });
    if (err.name === "ValidationError") return res.status(400).json({ message: "Submitted data is invalid." });
    if (err.name === "CastError" || err.name === "BSONError") return res.status(400).json({ message: "Invalid identifier." });
    if (err.name === "SyntaxError" && "body" in err) return res.status(400).json({ message: "Invalid JSON request body." });
    return res.status(500).json({ message: "Internal server error. Please try again." });
});

module.exports = app;
