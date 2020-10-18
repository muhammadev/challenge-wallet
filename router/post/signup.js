const bcrypt = require("bcrypt");
const User = require("../../models/User");
const {body, validationResult} = require("express-validator");

const validate = [
    body("username")
        .notEmpty()
        .custom(val => {
            if (/^[0-9]/g.test(val)) throw new Error("username should not begin with numbers")

            return true
        }),
    body("email")
        .isEmail()
        .custom(val => {
            return User.findOne({email: val}).then(user => {
                if (user) return Promise.reject("Email already in use")
            })
        }),
    body("password")
        .custom((val, {req}) => {
            const confirmation = req.body.confirm_password;
            if (val !== confirmation) {
                throw new Error("Password confirmation doesn't match password")
            }

            return true
        })
]

async function signup(req, res) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        console.log("validatoin errors", errs)
        res.locals.errs = errs.errors
        return res.render("signup")
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

module.exports.validate = validate
module.exports.signup = signup