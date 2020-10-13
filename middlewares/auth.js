const experss = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/User");
const app = experss();

app.use(cookieParser())


async function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        req.user = null
    } else {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET)
        if (!verified) return console.error("jwt error", err)

        const user = await User.findOne({email: verified.email})
        console.log("db user", user);
        if (!user) return console.error("error finding user", verified, user);

        res.locals.verified = true
        res.locals.user = user.username

        req.user = verified
    }
    next()
}

module.exports = auth