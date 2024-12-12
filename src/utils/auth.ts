import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const secretKey = "apple"

export const createJwtToken = (user: {
    name: string,
    dob: Date,
    phonenumber: string,
    aadharno: string,
    password: string,
    nationality: string,
}) => {
    const userWithDateString = {
        ...user,
        dob: user.dob.toString() // Convert Date to string
    };
    return jwt.sign(userWithDateString, secretKey, { expiresIn: "48h" });
}
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    // Extract token from Authorization header
    const tokenHeader = req.headers['authorization'] || req.cookies;
    if (!tokenHeader) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const token = tokenHeader.split(' ')[1]; // Extract token and trim whitespace

    try {
        const decoded = jwt.verify(token, secretKey);
        // console.log(decoded);
        req.user = decoded;
        next(); // Proceed to the next middleware
    } catch (error) {
        // Handle token verification errors
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};


