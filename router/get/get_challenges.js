const User = require("../../models/User")
const Challenge = require("../../models/Challenge");

async function get_challenges(req, res) {
    const user = await User.findOne({email: req.user.email});
    if (!user) {
        console.log("error finding user", user, req.user);
        return res.redirect("/signin");
    }

    Challenge.find({"creator": user.username})
        .then(function(challenges) {
            challenges.creator = user.username
            console.log(user.username, challenges.creator)
            res.render("my-challenges", {
                challenges
            })
        })
        .catch(err => {
            console.error("error searching challenges", err);
            res.redirect("/")
        })
}

module.exports = get_challenges