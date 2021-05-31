import {Client} from 'discord.js-commando';
import {discordConfig} from "../config";

const client = new Client({
    owner: discordConfig.owner,
    commandPrefix: discordConfig.prefix
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.login(discordConfig.apiToken);