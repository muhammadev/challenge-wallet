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
const auth = require("./middlewares/auth");
const User = require("./models/User");
const Challenge = require("./models/Challenge");
const signup = require("./router/signup");
const signin = require("./router/signin");
const createChallenge = require("./router/createChallenge");

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
    Challenge.find().then(challenges => {
        res.render("home", {
            challenges
        })
    }).catch(err => {
        console.log(err);
    })
})

// get signin
app.get("/signin", function(req, res) {
    res.render("signin")
})

// get signup
app.get("/signup", function(req, res) {
    res.render("signup")
})

// get logout
app.get("/logout", (req, res) => {
    res.clearCookie("token")
    res.redirect("/")
})

// get create
app.get("/create", auth, (req, res) => {
    res.render("create")
})

// get my-challenges
app.get("/my-challenges", auth, async function(req, res) {
    const user = await User.findOne({email: req.user.email});
    if (!user) {
        console.log("error finding user", user, req.user);
        return res.redirect("/signin");
    }

    Challenge.find({"creator": user.username})
        .then(function(challenges) {
            res.render("my-challenges", {
                challenges
            })
        })
        .catch(err => {
            console.error("error searching challenges", err);
            res.redirect("/")
        })
})

// get wallet
app.get("/wallet", auth, function(req, res) {
    res.render("wallet")
})

// get dead challenges
app.get("/dead-challenges", auth, function(req, res) {
    res.render("dead")
})

// ------------POST Requests------------
// POST signup
app.post("/signup", [
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
], signup)

// POST signin
app.post("/signin", [
    body("email")
        .isEmail(),
    body("password")
        .notEmpty()
], signin);

// POST create
app.post("/create", auth, [
    body("challenge_name")
        .trim()
        .notEmpty().withMessage("Challenge Name Should Not Be Empty"),
    body("time_deadline")
        .custom(val => {
            if (val && val.length > 0) {
                if (val) {
                    let regex = /^\d+:\d+$/g;
                    if (!regex.test(val)) throw new Error("Time Format Is Not Valid")
    
                    return true
                }
            }

            return true
        }),
    body("date_format")
        .customSanitizer((val, {req}) => {
            if (val) {
                const is_daily = req.body.is_daily;
    
                if (is_daily) {
                    val = null
                }
            }
        }),
    body("cost")
        .isNumeric().withMessage("Cost Must Be A Number"),
    body("rules")
        .trim()
        .notEmpty().withMessage("Please Set Some Rules")
], createChallenge)

// -----------------listen to port-----------------
const port = process.env.PORT || 8000
app.listen(port, console.log("connected to", port))