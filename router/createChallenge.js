const User = require("../models/User");
const Challenge = require("../models/Challenge")
const {validationResult} = require("express-validator");

async function createChallenge(req, res) {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
        res.locals.errs = errs.errors
        return res.render("create")
    }

    let {challenge_name, deadline, days, is_daily, cost, rules} = req.body

    if (is_daily) {
        days = Infinity
        is_daily = true
    } else {
        is_daily = false
    }

    const user = await User.findOne({email: req.user.email});
    const creator = user.username
    if (!creator) {
        console.log("error finding creator", creator);
        return res.redirect("/create")
    }
    console.log({creator});

    let schema = {
        challenge_name,
        creator,
        deadline,
        days,
        is_daily,
        cost,
        rules
    };

    console.log(schema);

    let challenge = new Challenge(schema)

    challenge.save(function(err, data) {
        if (err) {
            console.error("error saving challenge to db", err);
            return res.redirect("/create")
        }

        console.log(data);

        res.redirect("/")
    })
}

module.exports = createChallenge