require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const path = require("path");
const fs = require("fs");

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.colour = "0x62b8f3";
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(path.join(__dirname, "./functions"));
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(path.join(__dirname, `./functions/${folder}`))
        .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles)
        require(path.join(__dirname, `./functions/${folder}/${file}`))(client);
}

// Command handling logic here
client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(process.env.DISCORD_TOKEN);
