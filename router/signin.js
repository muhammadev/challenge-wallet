const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator");

async function signin(req, res) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return console.error("validation errors", errs)

    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
        console.log("user not found")
        return res.redirect("/signin")
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            console.error("error comparing passwords", err);
            return res.redirect("/signin")
        }

        console.log(result);

        if (!result) {
            console.log("password is not correct");
            return res.redirect("/signin")
        }

        const token = jwt.sign({email}, process.env.TOKEN_SECRET)
        res.cookie("token", token, {httpOnly: true})
        console.log("***my cookies***", req.cookies.token);
        res.redirect("/")
    })

    const token = jwt.sign({email: email}, process.env.TOKEN_SECRET)
    res.cookie("token", token, {httpOnly: true, secure: true})
}

module.exports = signin