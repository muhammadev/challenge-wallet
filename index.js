const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const auth = require("./middlewares/auth");
const Challenge = require("./models/Challenge");
const signup = require("./router/post/signup");
const signin = require("./router/post/signin");
const createChallenge = require("./router/post/createChallenge");
const get_challenges = require("./router/get/get_challenges");

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
app.get("/my-challenges", auth, get_challenges)

// // get challenge/:id
// app.get("/challenge/:id", role, function(req, res) {

// })

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
app.post("/signup", [...signup.validate], signup.signup)

// POST signin
app.post("/signin", [...signin.validate], signin.signin);

// POST create
app.post("/create", auth, [...createChallenge.validate], createChallenge.create)

// -----------------listen to port-----------------
const port = process.env.PORT || 8000
app.listen(port, console.log("connected to", port))