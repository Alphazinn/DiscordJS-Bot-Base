const mongoose = require("mongoose");

module.exports = mongoose.model("Guild", new mongoose.Schema({
    GUILD_ID: {
        type: String,
        required: true,
        unique: true
    },

    LANGUAGE: {
        type: String,
        default: "EN"
    }
}));