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
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.candidate.findMany();
    res.send(result);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, nationality, dob, partyName, partyLogo } = req.body;
    console.log(dob);
    let candidateY = new Date(dob);
    console.log();
    let today = new Date();
    const candidateAge = today.getFullYear() - candidateY.getFullYear();
    console.log(candidateAge);
    // console.log(nationality);
    if (nationality !== "Indian" || candidateAge <= 35) {
        return res.status(404).send("you're not egligible");
    }
    // console.log("egligible");
    else {
        let result = yield prisma.candidate.create({
            data: {
                fullName: fullname,
                dob: candidateY,
                nationality: nationality,
                partyname: partyName,
                partylogo: partyLogo,
            }
        });
        res.send(result);
    }
}));
// router.put("/:id", async (req, res) => {
//     const id = req.params.id;
//     const { name, partyname, logo } = req.body;
//     let result = await prisma.candidate.update({
//         where: {
//             id: Number(id),
//         },
//         data: {
//             fullName: name,
//             partyname: partyname,
//             partylogo: logo,
//         }
//     })
//     res.send({ result: result });
// })
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { fullName, partyname, partylogo } = req.body;
    try {
        const result = yield prisma.candidate.update({
            where: {
                id: Number(id),
            },
            data: {
                fullName: fullName,
                partyname: partyname,
                partylogo: partylogo,
            }
        });
        res.send({ result: result });
    }
    catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).send({ message: 'Failed to update candidate. Please try again later.' });
    }
}));
// router.delete("/:id", async (req, res) => {
//     const id = req.params.id;
//     try {
//         let candidate = await prisma.candidate.findUnique({
//             where: { id: Number(id) },
//             include: {
//                 votes: true,
//             }
//         });
//         if (!candidate) {
//             return res.status(404).send("Candidate not found");
//         }
//         const totalVotes = candidate.votes.length;
//         const halfTotalVotes = Math.ceil(totalVotes / 2);
//             await prisma.candidate.delete({
//                 where: {
//                     id: Number(id),
//                 },
//             });
//             return res.send("Candidate deleted successfully.");
//         }
//     catch (error) {
//         console.error("Error deleting candidate:", error);
//         return res.status(500).send("Internal Server Error");
//     }
// });
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let candidate = yield prisma.candidate.findUnique({
            where: { id: Number(id) },
            include: {
                votes: true,
            }
        });
        if (!candidate) {
            return res.status(404).send("Candidate not found");
        }
        const totalVotes = candidate.votes.length;
        const halfTotalVotes = Math.ceil(totalVotes / 2);
        // Prevent deletion if votes are more than half
        if (totalVotes > halfTotalVotes) {
            return res.status(400).json({ message: "Cannot delete candidate with more than half the votes." });
        }
        yield prisma.candidate.delete({
            where: {
                id: Number(id),
            },
        });
        return res.send("Candidate deleted successfully.");
    }
    catch (error) {
        console.error("Error deleting candidate:", error);
        return res.status(500).send("Internal Server Error");
    }
}));
exports.default = router;
