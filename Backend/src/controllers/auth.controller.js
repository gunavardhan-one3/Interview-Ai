const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

const COOKIE_NAME = "token";
const TOKEN_TTL_SECONDS = 24 * 60 * 60;
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS * 1000,
};

function createToken(user) {
    return jwt.sign(
        { id: user._id.toString(), username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_TTL_SECONDS }
    );
}

function publicUser(user) {
    return { id: user._id, username: user.username, email: user.email };
}

async function registerUserController(req, res) {
    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are required." });
    }
    if (username.length < 3 || username.length > 40) {
        return res.status(400).json({ message: "Username must be between 3 and 40 characters." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
        return res.status(400).json({ message: "Please provide a valid email address." });
    }
    const passwordBytes = Buffer.byteLength(password, "utf8");
    if (passwordBytes < 8 || passwordBytes > 72) {
        return res.status(400).json({ message: "Password must be at least 8 characters and no more than 72 bytes." });
    }

    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(409).json({ message: "A user with this username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({ username, email, password: hashedPassword });
    res.cookie(COOKIE_NAME, createToken(user), cookieOptions);
    return res.status(201).json({ message: "User registered successfully.", user: publicUser(user) });
}

async function loginUserController(req, res) {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await userModel.findOne({ email }).select("+password");
    const validPassword = user ? await bcrypt.compare(password, user.password) : false;
    if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password." });
    }

    res.cookie(COOKIE_NAME, createToken(user), cookieOptions);
    return res.status(200).json({ message: "Logged in successfully.", user: publicUser(user) });
}

async function logoutUserController(req, res) {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            decoded = null;
        }
        if (decoded?.exp && decoded.exp * 1000 > Date.now()) {
            await tokenBlacklistModel.updateOne(
                { token },
                { $setOnInsert: { token, expiresAt: new Date(decoded.exp * 1000) } },
                { upsert: true }
            );
        }
    }

    res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
});
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id).select("username email");
    if (!user) {
        res.clearCookie(COOKIE_NAME, cookieOptions);
        return res.status(404).json({ message: "User account was not found." });
    }
    return res.status(200).json({ message: "User details fetched successfully.", user: publicUser(user) });
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };
