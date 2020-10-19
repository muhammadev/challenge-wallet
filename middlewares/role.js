const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require(dotenv);
const jwt = require("jsonwebtoken");
const Challenge = require("../models/Challenge");

// important settings
dotenv.config() // to access .env file vars
app.use(cookieParser()) // to parse the browser cookies

function role(req, res, next) {
    // check who wants to access, and give him the right role


    // who wants to access?
    let token = req.cookies.token
    // if not token found
    if (!token) {
        console.log("no token found", token);
        return res.redirect("/signin")
    }
    // else, check this is a valid token, that means user is logged in successfully
    jwt.verify(token, process.env.TOKEN_SECRET)
    .then(verifiedUser => {
        // now see what role he has into this challenge he want to access
        Challenge.findOne({_id: req.params.id})
        .then(challenge => {
            
        })
    })
    .catch(err => {
        console.log("invalid token", err);
        return res.redirect("/signin")
    })
}