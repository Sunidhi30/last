"use strict";
// import { PrismaClient } from '@prisma/client';
// import express from "express";
// import { createJwtToken } from "../utils/auth";
// const router = express.Router();
// const prisma = new PrismaClient();
// router.post("/", async (req, res) => {
//     const { username, password } = req.body;
//     if (username === "admin" && password === "admin") {
//          return res.send("admin");
//         // return res.redirect("/admin");
//     }
//     const result = await prisma.voter.findUnique({
//         where: {
//             aadharno: username,
//             password: password,
//         }
//     })
//     if (!result) {
//         throw new Error("Not valid username")
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
//     }
//     if (result.password != password) {
//         throw new Error("Not a valid password");
//     }
//     const token = createJwtToken(result);
//     res.cookie("token", token);
//     // console.log(token);
//     // es.redirect("/voter");
//     // localStorage.setItem("token", token);
//     res.send({token});
// })
// export default router;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../utils/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (username === "admin" && password === "admin") {
            return res.send("admin");
        }
        const result = yield prisma.voter.findUnique({
            where: {
                aadharno: username,
            }
        });
        if (!result) {
            // Return a 401 status with error message
            return res.status(401).send({ message: "Invalid Aadhar number" });
        }
        if (result.password !== password) {
            // Return a 401 status with error message
            return res.status(401).send({ message: "Invalid password" });
        }
        const token = (0, auth_1.createJwtToken)(result);
        res.cookie("token", token);
        res.send({ token });
    }
    catch (error) {
        // Catch any unexpected errors and send them as a 500 status
        res.status(500).send({ message: error.message || "Internal Server Error" });
    }
}));
exports.default = router;
