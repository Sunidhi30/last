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
const express_1 = __importDefault(require("express"));
// import twilio from 'twilio'; // Import Twilio SDK
const auth_1 = require("../utils/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Twilio configuration
// const twilioClient = twilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');
// const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';
router.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isvoted) {
        return res.send("already voted");
    }
    let data = yield prisma.candidate.findMany({
        orderBy: { fullName: 'asc' }
    });
    console.log(data);
    res.send(data);
}));
router.get("/voterDetails", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.user.id;
        console.log(id);
        const data = yield prisma.voter.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!data) {
            return res.status(404).send("Voter not found");
        }
        console.log(data);
        res.send(data);
    }
    catch (error) {
        console.error("Error fetching voter details:", error);
        res.status(500).send("Failed to fetch voter details. Please try again later.");
    }
}));
router.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { candidateId } = req.body;
    console.log(candidateId);
    yield prisma.candidate.update({
        where: {
            id: Number(candidateId),
        },
        data: {
            totalvotes: { increment: 1 }
        }
    });
    yield prisma.votes.create({
        data: {
            voterid: req.user.id,
            candidateid: candidateId,
        }
    });
    const updatedVoter = yield prisma.voter.update({
        where: { id: req.user.id },
        data: { isvoted: true }
    });
    req.user.isvoted = true;
    // Fetch voter's phone number
    const voter = yield prisma.voter.findUnique({
        where: { id: req.user.id }
    });
    // Send SMS using Twilio
    // if (voter && voter.phonenumber) {
    //     try {
    //         await twilioClient.messages.create({
    //             body: `Your vote for candidate ID ${candidateId} has been successfully cast.`,
    //             from: twilioPhoneNumber,
    //             to: voter.phonenumber
    //         });
    //         console.log('SMS sent successfully');
    //     } catch (smsError) {
    //         console.error('Error sending SMS:', smsError);
    //     }
    // }
    res.json({ message: "voting done", email: voter === null || voter === void 0 ? void 0 : voter.email });
    // res.send("voting done");
}));
router.get("/success", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { candidateId } = req.query;
        const candidate = yield prisma.candidate.findUnique({
            where: { id: Number(candidateId) }
        });
        res.render("votingSuccess", { candidate });
    }
    catch (error) {
        console.error("Error fetching candidate details:", error);
        res.status(500).send("Internal Server Error");
    }
}));
exports.default = router;
