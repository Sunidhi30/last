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
const crypto_1 = __importDefault(require("crypto"));
const express_1 = __importDefault(require("express"));
// import { sendEmail } from "../utils/verify";
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, dob, phoneNumber, aadharNo, password, nationality, email } = req.body;
    console.log(dob);
    console.log(aadharNo);
    const voterDob = new Date(dob);
    console.log(voterDob);
    const today = new Date();
    const voterAge = today.getFullYear() - voterDob.getFullYear();
    // Check if the voter is eligible
    if (voterAge < 18 || nationality !== 'Indian') {
        return res.status(400).send("You are not eligible to register as a voter.");
    }
    // Check if another voter with the same Aadhar no is already registered
    const existingVoter = yield prisma.voter.findUnique({
        where: {
            aadharno: aadharNo
        }
    });
    if (existingVoter) {
        return res.status(400).send("Another voter with the same Aadhar number is already registered.");
    }
    // Create a new voter
    const newVoter = yield prisma.voter.create({
        data: {
            name: name,
            dob: voterDob,
            email: email,
            phonenumber: phoneNumber,
            aadharno: aadharNo,
            password: password,
            nationality: nationality,
        }
    });
    let token = yield prisma.token.create({
        data: {
            voterid: newVoter.id,
            token: crypto_1.default.randomBytes(32).toString("hex"),
        }
    });
    console.log(token);
    //   const message = `${process.env.BASE_URL}/user/verify/${newVoter.id}/${token.token}`;
    //   await sendEmail(newVoter.email, "Verify Email", message);
    //   res.send("verify your email by clicking link send to your email");
    res.status(201).send({ message: "Registration successful.", voter: newVoter });
}));
exports.default = router;
