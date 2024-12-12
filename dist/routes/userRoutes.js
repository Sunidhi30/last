"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto")); // Use ES module import for crypto
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body; // Ensure email is a string
    console.log(email);
    try {
        // Check if email exists in the database using Prisma and voter model
        const voter = yield prisma.voter.findUnique({
            where: { email },
        });
        console.log(voter);
        if (!voter) {
            return res.status(400).json({ message: 'Voter with this email does not exist' });
        }
        // Generate a token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        // Store the token and expiration in the database using Prisma
        yield prisma.voter.update({
            where: { id: voter.id }, // Use the voter's ID since email is not unique
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires,
            },
        });
        // Send back the token to the frontend
        res.json({ token: resetToken });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
// POST route to reset password
router.post('/reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    try {
        // Find the user by reset token and ensure token is not expired
        const user = yield prisma.voter.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date(), // Check if the token is still valid
                },
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Update the user's password and clear the reset token
        yield prisma.voter.update({
            where: { id: user.id },
            data: {
                password, // Make sure to hash the password before storing it
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        res.json({ message: 'Password reset successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
// POST route to reset password
router.post('/reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    try {
        // Find the user by reset token and ensure token is not expired
        const user = yield prisma.voter.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date(), // Check if the token is still valid
                },
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Update the user's password and clear the reset token
        yield prisma.voter.update({
            where: { id: user.id },
            data: {
                password, // Make sure to hash the password before storing it
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        res.json({ message: 'Password reset successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
exports.default = router; // Use ES module export
