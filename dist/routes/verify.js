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
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cryptojs = require("crypto");
let { sendEmail } = require("../utils/util");
const Token = require("../model/token");
const User = require("../model/user");
router.get("/", (req, res) => {
    res.render("home");
});
router.get("/register", (req, res) => {
    res.render("register");
});
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    console.log(email);
    bcrypt.hash(password, saltRounds).then(function (hash) {
        return __awaiter(this, void 0, void 0, function* () {
            // Store hash in your password DB.
            const newUser = new User({ username, email, password: hash });
            yield newUser.save();
            let token = yield new Token({
                userId: newUser._id,
                token: cryptojs.randomBytes(32).toString("hex"),
            }).save();
            const message = `${process.env.BASE_URL}/user/verify/${newUser.id}/${token.token}`;
            yield sendEmail(newUser.email, "Verify Email", message);
            res.send("verify your email by clicking link send to your email");
        });
    });
}));
router.get("/verify/:id/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let user = yield User.findOne({ _id: id });
    if (!user)
        return res.status(400).send("Invalid link");
    let token = yield Token.findOne({ userId: id, token: req.params.token });
    if (!token)
        return res.status(400).send("Invalid link");
    // await User.updateOne({_id:user.id,verify:true});
    user.verify = true;
    yield user.save();
    yield Token.findByIdAndDelete(token._id);
    res.redirect("/api/user");
}));
module.exports = router;
