import {Client} from 'discord.js-commando';
import {discordConfig} from "../config";
import AddServerCommand from "./commands/admin/AddServerCommand";
import ExecuteCommand from "./commands/admin/ExecuteCommand"
import AuthenticateCommand from "./commands/auth/AuthenticateCommand"
import ConfirmCommand from "./commands/auth/ConfirmCommand"
import initSequelize from "./sequelize";
import initUtils from './util';
import initWebhooks from './webhooks';

initSequelize();

const client = new Client({
    owner: discordConfig.owner,
    commandPrefix: discordConfig.prefix
});

client.registry
    .registerGroups([
        ['admin', 'Administration commands'],
        ['authentication', 'Authentication commands']
    ])
    .registerDefaults()
    .registerCommands([AddServerCommand, ExecuteCommand, AuthenticateCommand, ConfirmCommand])

client.on('ready', async () => {
    initUtils(client);
    console.log(`Logged in as ${client.user.tag}`);

    initWebhooks();
});

client.login(discordConfig.apiToken);