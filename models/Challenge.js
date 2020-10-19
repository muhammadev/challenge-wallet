const mongoose = require("mongoose");

const date = new Date();
const timeNow = `${date.getHours()}:${date.getMinutes()}`;

const challengeSchema = new mongoose.Schema({
    challenge_name: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        default: timeNow
    },
    days: {
        type: Number,
        default: 30
    },
    is_daily: {
        type: Boolean,
        default: true
    },
    cost: {
        type: Number,
        required: true
    },
    rules: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    participants: {
        type: Object,
        default: {
            creator: "owner"
        }
    }
})

module.exports = mongoose.model("Challenge", challengeSchema)