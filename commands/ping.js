const { SlashCommandBuilder } = require("@discordjs/builders");
const { GetTextByLanguage } = require("../ALPHACore.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping Pong!")
    ,

    async execute(interaction, language, client) {
        await interaction.reply(GetTextByLanguage(language, "PING").replace("-[PING]-", client.ws.ping));
    }
};