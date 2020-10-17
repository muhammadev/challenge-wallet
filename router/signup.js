const bcrypt = require("bcrypt");
const User = require("../models/User");
const {validationResult} = require("express-validator");

async function signup(req, res) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        console.log("validatoin errors", errs)
        return res.redirect("/signup")
    }

    const {username, email, password} = req.body;

    console.log({password});

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return console.log("error hashing password", err);

        console.log({hash});

        let user = new User({
            username,
            email,
            password: hash
        })

        user.save(function(err, user) {
            if (err) return console.log("err saving user", err);

            console.log(user);

            res.redirect("/");
        })
    })
}

module.exports = signup