"use strict";
// import { PrismaClient } from '@prisma/client';
// import cookieparser from "cookie-parser";
// import CORS from 'cors';
// import express from "express";
// import adminRoute from "./routes/admin";
// import loginRoute from "./routes/login";
// import voterRoute from "./routes/voter";
// import votingRoute from "./routes/voting";
// const app = express();
// const prisma = new PrismaClient();
// const PORT = 4444;
// app.use(CORS());
// app.use(express.json());
// app.use(cookieparser());
// app.use(express.urlencoded({ extended: true }))
// app.get("/", (req, res) => {
//     res.send("home");
// })
// // async function addAdmin(){
// //     await prisma.admin.create({
// //         data:{
// //             username:"admin",
// //             password:"admin",
// //         }
// //     })
// // }
// // addAdmin();
// app.use("/login", loginRoute);
// app.use("/admin", adminRoute);
// app.use("/voter", voterRoute);
// app.use("/voting", votingRoute);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // app.use('/upload', uploadRoutes); 
// app.listen(PORT, () => {
//     console.log(`http://localhost:${PORT}`);;
// })
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("./routes/admin"));
const login_1 = __importDefault(require("./routes/login"));
const upload_1 = __importDefault(require("./routes/upload")); // Make sure you have the upload route
const voter_1 = __importDefault(require("./routes/voter"));
const voting_1 = __importDefault(require("./routes/voting"));
// console.log("love is blind")
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = 4444;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("home");
});
// Uncomment the function if you want to add an admin on start
// async function addAdmin(){
//     await prisma.admin.create({
//         data:{
//             username:"admin",
//             password:"admin",
//         }
//     })
// }
// addAdmin();
// Use defined routes
app.use("/login", login_1.default);
app.use("/admin", admin_1.default);
app.use("/voter", voter_1.default);
app.use("/voting", voting_1.default);
app.use("/forgot-password", userRoutes_1.default);
// Serve static files for uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Use upload route
app.use('/admin/upload', upload_1.default); // Uncomment to use the upload route
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
