const User = require("../../models/User");
const Challenge = require("../../models/Challenge")
const {body, validationResult} = require("express-validator");

const validate = [
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
]

async function create(req, res) {
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
    const creator = user._id
    if (!creator || !user) {
        console.log("error finding creator", creator);
        return res.redirect("/signin")
    }
    console.log({creator});

    let participants = {};
    participants[creator] = "owner"

    let schema = {
        challenge_name,
        deadline,
        days,
        cost,
        is_daily,
        rules,
        creator,
        participants
    };

    console.log(schema);

    let challenge = new Challenge(schema)

    challenge.save(async function(err, data) {
        if (err) {
            console.error("error saving challenge to db", err);
            return res.redirect("/create")
        }

        console.log(data);

        let challengeId = data._id;
        user.challenges[challengeId] = "owner"
        let updated = await user.save()
        console.log({challengeId}, {updated});

        res.redirect("/")
    })
}

module.exports.validate = validate
module.exports.create = create