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

// // app.use('/upload', uploadRoutes); 

// app.listen(PORT, () => {
//     console.log(`http://localhost:${PORT}`);;
// })
import { PrismaClient } from '@prisma/client';
import cookieparser from "cookie-parser";
import CORS from 'cors';
import express from "express";
import adminRoute from "./routes/admin";
import loginRoute from "./routes/login";
import uploadRoutes from './routes/upload'; // Make sure you have the upload route
import voterRoute from "./routes/voter";
import votingRoute from "./routes/voting";
// console.log("love is blind")

import forgotPassword from "./routes/userRoutes";

const app = express();
const prisma = new PrismaClient();
const PORT = 4444;

app.use(CORS());
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));

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
app.use("/login", loginRoute);
app.use("/admin", adminRoute);
app.use("/voter", voterRoute);
app.use("/voting", votingRoute);
app.use("/forgot-password",forgotPassword);


// Serve static files for uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use upload route
app.use('/admin/upload', uploadRoutes); // Uncomment to use the upload route

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
