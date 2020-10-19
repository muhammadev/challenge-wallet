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
        console.log("to token found");
        return res.redirect("/signin")
    } else {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, verifiedToken) => {
            if (err) {
                console.error("invalid token", token, err);
                return res.redirect("/signin")
            }
            const user = await User.findOne({email: verifiedToken.email})

            if (!user) {
                console.error("error finding user", verifiedToken, user);
                res.locals.errs = [{
                    param: "something went wrong",
                    msg: "please login again"
                }]
                return res.render("signin")
            }
    
            res.locals.verified = true
            res.locals.user = user.username
    
            req.user = verifiedToken
            next()
        })
    }
}

module.exports = auth