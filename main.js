const { CreateGuildOnGuildsTable } = require("./ALPHACore.js");
const { Token, MongoURL } = require("./config.json");

const { REST, Routes, Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { connect } = require("mongoose");
const moment = require("moment");

const client = new Client({ "intents": 3248127 });
client.commands = new Collection();

const MongoDBGuild = require("./database/Guild.js");

const GetCurrentTime = (format) => {
    return moment(Date.now()).format(format);
};

client.on("ready", async () => {
    console.log(`\u001b[1;34m[${GetCurrentTime("LTS")}] \u001b[1;35m${client.user.username} Is Now Online`);
    console.log(`\u001b[1;34m[${GetCurrentTime("LTS")}] \u001b[1;36m[${client.guilds.cache.size} Guilds] - [${client.channels.cache.size} Channels] - [${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} Users]`);

    const CommandFiles = readdirSync("./commands").filter(file => file.endsWith(".js"));
    const Commands = [];
    for (const file of CommandFiles) {
        const command = require(`./commands/${file}`);
        Commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    };

    const rest = new REST({ version: "10" }).setToken(Token);
    try {
        console.log(`\u001b[1;34m[${GetCurrentTime("LTS")}] \u001b[1;33mRefreshing Application (/) Commands`);

        await rest.put(Routes.applicationCommands(client.user.id), { body: Commands });

        console.log(`\u001b[1;34m[${GetCurrentTime("LTS")}] \u001b[1;33mSlash Commands Succesfully Registered \u001b[1;31mGLOBALLY!`);
    } catch (error) {
        console.error(error);
    };

    try {
        connect(MongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log(`\u001b[1;34m[${GetCurrentTime("LTS")}] \u001b[1;32mMongoDB Connection Established`)
        });
    } catch (error) {
        console.log(`\u001b[1;34m[${GetCurrentTime("LTS")}] \u001b[1;31mMongoDB Connection Failed\nError: ${error}`);
    };
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const GetGuildData = await MongoDBGuild.findOne({ GUILD_ID: interaction.guild.id });
    if (GetGuildData === null) {
        await CreateGuildOnGuildsTable(interaction.guild);
    };

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    let Language;
    switch (interaction.locale) {
        case "en-GB":
            Language = "en";
            break;

        case "tr":
            Language = "tr";
            break;

        default:
            Language = "en";
            break;
    };

    command.execute(interaction, Language, client);
});

client.login(Token);