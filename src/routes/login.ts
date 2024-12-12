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

import { PrismaClient } from '@prisma/client';
import express from "express";
import { createJwtToken } from "../utils/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (username === "admin" && password === "admin") {
            return res.send("admin");
        }

        const result = await prisma.voter.findUnique({
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

        const token = createJwtToken(result);
        res.cookie("token", token);
        res.send({ token });
    } catch (error:any) {
        // Catch any unexpected errors and send them as a 500 status
        res.status(500).send({ message: error.message || "Internal Server Error" });
    }
});

export default router;
