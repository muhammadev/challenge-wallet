const experss = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/User");
const app = experss();

app.use(cookieParser())


function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        req.user = null
        res.redirect("/signin")
    } else {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, verifiedToken) => {
            if (err) {
                console.error("invalid token", token, err);
                res.redirect("/signin")
            }
            const user = await User.findOne({email: verifiedToken.email})
            console.log("db user", user);

            if (!user) {
                console.error("error finding user", verifiedToken, user);
                return res.redirect("/")
            }
    
            res.locals.verified = true
            res.locals.user = user.username
    
            req.user = verifiedToken
            next()
        })
    }
}

module.exports = auth