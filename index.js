const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const register = require("./router/register");
const auth = require("./middlewares/auth");
const User = require("./models/User");

// git config vars
dotenv.config();

// connecting to db
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(console.log("connected to db"))
    .catch(err => console.error("Error connecting to db", err))

// serve static files
app.use(express.static(path.join(__dirname, "public")))
// cookie parser
app.use(cookieParser())
// body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// ------------GET Requests------------
// get home
app.get("/", auth, (req, res) => {
    console.log("req.user", req.user);
    if (!req.user) return res.redirect("/signin")

    res.render("home")
})

// get signin
app.get("/signin", function(req, res) {
    res.render("signin")
})

// get register
app.get("/register", function(req, res) {
    res.render("register")
})

// get logout
app.get("/logout", (req, res) => {
    res.clearCookie("token")
    res.redirect("/")
})

// ------------POST Requests------------
// POST register
app.post("/register", [
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
], (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        console.log("validatoin errors", errs)
        return res.redirect("/register")
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
})

// POST signin
app.post("/signin", [
    body("email")
        .isEmail(),
    body("password")
        .notEmpty()
], async (req, res) => {
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
    res.cookie("token", token, {httpOnly: true})



})

// listen to port
const port = process.env.PORT || 8000
app.listen(port, console.log("connected to", port))