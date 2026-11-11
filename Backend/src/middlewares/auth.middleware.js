const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Authentication required." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const isBlacklisted = await tokenBlacklistModel.exists({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        req.user = decoded;
        return next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired session." });
        }
        return next(error);
    }
}

module.exports = { authUser };
