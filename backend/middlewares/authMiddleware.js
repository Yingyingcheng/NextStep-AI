const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
    // --- DEV BYPASS: skip auth when BYPASS_AUTH=true ---
    if (process.env.BYPASS_AUTH === "true") {
        // Find or create a dev user so req.user is always valid
        let devUser = await User.findOne({ email: "dev@dev.com" });
        if (!devUser) {
            devUser = await User.create({
                name: "Dev User",
                email: "dev@dev.com",
                password: "bypass", // never used for login
            });
        }
        req.user = devUser;
        return next();
    }
    // --- END DEV BYPASS ---

    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; // Extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        res.status(401).json({ message: "Token failed", error: error.message });
    }
};

module.exports = { protect };
