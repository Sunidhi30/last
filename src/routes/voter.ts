import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto';
import express from "express";
// import { sendEmail } from "../utils/verify";
const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
    const { name, dob, phoneNumber, aadharNo, password, nationality,email } = req.body;
    console.log(dob)
    console.log(aadharNo)
    const voterDob = new Date(dob);
    console.log(voterDob);
    const today = new Date();
    const voterAge = today.getFullYear() - voterDob.getFullYear();

    // Check if the voter is eligible
    if (voterAge < 18 || nationality !== 'Indian') {
        return res.status(400).send("You are not eligible to register as a voter.");
    }

    // Check if another voter with the same Aadhar no is already registered
    const existingVoter = await prisma.voter.findUnique({
        where: {
            aadharno: aadharNo
        }
    });

    if (existingVoter) {
        return res.status(400).send("Another voter with the same Aadhar number is already registered.");
    }
 
    // Create a new voter
    const newVoter = await prisma.voter.create({
        data: {
            name: name,
            dob: voterDob,
            email:email,
            phonenumber: phoneNumber,
            aadharno: aadharNo,
            password: password,
            nationality: nationality,

        }
    });
    let token = await prisma.token.create({
       data:{ 
        voterid: newVoter.id,
        token: CryptoJS.randomBytes(32).toString("hex"),
       }
      });
      console.log(token)
    //   const message = `${process.env.BASE_URL}/user/verify/${newVoter.id}/${token.token}`;
    //   await sendEmail(newVoter.email, "Verify Email", message);
    //   res.send("verify your email by clicking link send to your email");
    res.status(201).send({ message: "Registration successful.", voter: newVoter });
});

export default router;