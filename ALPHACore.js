"use strict";

const fs = require("fs");

const MongoDBGuild = require("./database/Guild.js");

module.exports.GetTextByLanguage = function GetTextByLanguage(Language, Text) {
    let LanguageArray = fs.readFileSync(`./languages/${Language}.json`);
    let ParseArray = JSON.parse(LanguageArray);

    return ParseArray[Text];
};

module.exports.CreateGuildOnGuildsTable = async function CreateGuildOnGuildsTable(Guild) {
    return await MongoDBGuild.create({ GUILD_ID: Guild.id, LANGUAGE: "EN" });
};