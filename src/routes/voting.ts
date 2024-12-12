import { PrismaClient } from '@prisma/client';
import express from "express";
// import twilio from 'twilio'; // Import Twilio SDK
import { verifyToken } from "../utils/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Twilio configuration
// const twilioClient = twilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');
// const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';

router.get("/", verifyToken, async (req, res) => {
    if (req.user.isvoted) {
        return res.send("already voted");
    }
    let data = await prisma.candidate.findMany({
        orderBy: { fullName: 'asc' }
    });
    console.log(data);
    res.send(data);
});

router.get("/voterDetails", verifyToken, async (req, res) => {
    try {
        let id = req.user.id;
        console.log(id);
        const data = await prisma.voter.findUnique({
            where: {
                id: Number(id)
            }
            
        });
      
        if (!data) {
            return res.status(404).send("Voter not found");
        }
        console.log(data);
        res.send(data);
    } catch (error) {
        console.error("Error fetching voter details:", error);
        res.status(500).send("Failed to fetch voter details. Please try again later.");
    }
});

router.post("/", verifyToken, async (req, res) => {
    const { candidateId } = req.body;
    console.log(candidateId);

    await prisma.candidate.update({
        where: {
            id: Number(candidateId),
        },
        data: {
            totalvotes: { increment: 1 }
        }
    });
    await prisma.votes.create({
        data: {
            voterid: req.user.id,
            candidateid: candidateId,
        }
    });
    const updatedVoter = await prisma.voter.update({
        where: { id: req.user.id }, 
        data: { isvoted: true }
    });
    req.user.isvoted = true;

    // Fetch voter's phone number
    const voter = await prisma.voter.findUnique({
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
   res.json({message : "voting done", email :voter?.email})
    // res.send("voting done");
});

router.get("/success", async (req, res) => {
    try {
        const { candidateId } = req.query;
        const candidate = await prisma.candidate.findUnique({
            where: { id: Number(candidateId) }
        });
        res.render("votingSuccess", { candidate });
    } catch (error) {
        console.error("Error fetching candidate details:", error);
        res.status(500).send("Internal Server Error");
    }
});


export default router;
