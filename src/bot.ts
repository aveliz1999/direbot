import {Client} from 'discord.js-commando';

const client = new Client({
    owner: '',
    commandPrefix: ''
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.login();