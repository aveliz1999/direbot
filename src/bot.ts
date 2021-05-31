import {Client} from 'discord.js-commando';
import {discordConfig} from "../config";
import initSequelize from "./sequelize";

initSequelize();

const client = new Client({
    owner: discordConfig.owner,
    commandPrefix: discordConfig.prefix
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(discordConfig.apiToken);