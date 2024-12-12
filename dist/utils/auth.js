"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = "apple";
const createJwtToken = (user) => {
    const userWithDateString = Object.assign(Object.assign({}, user), { dob: user.dob.toString() // Convert Date to string
     });
    return jsonwebtoken_1.default.sign(userWithDateString, secretKey, { expiresIn: "48h" });
};
exports.createJwtToken = createJwtToken;
const verifyToken = (req, res, next) => {
    // Extract token from Authorization header
    const tokenHeader = req.headers['authorization'] || req.cookies;
    if (!tokenHeader) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    const token = tokenHeader.split(' ')[1]; // Extract token and trim whitespace
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        // console.log(decoded);
        req.user = decoded;
        next(); // Proceed to the next middleware
    }
    catch (error) {
        // Handle token verification errors
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
exports.verifyToken = verifyToken;
