const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");

const validate = [
    body("email")
        .isEmail(),
    body("password")
        .notEmpty()
]

async function signin(req, res) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        console.error("validation errors", errs)
        res.locals.errs = errs.errors
        return res.render("signin")
    }

    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
        console.log("user not found")
        res.locals.errs = [{
            param: "user not found"
        }]
        return res.render("signin")
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

module.exports.validate = validate
module.exports.signin = signin