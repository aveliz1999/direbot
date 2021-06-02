import {Client} from 'discord.js-commando';
import {discordConfig} from "../config";
import AddServerCommand from "./commands/admin/AddServerCommand";
import ExecuteCommand from "./commands/admin/ExecuteCommand"
import AuthenticateCommand from "./commands/auth/AuthenticateCommand"
import ConfirmCommand from "./commands/auth/ConfirmCommand"
import BroadcastCommand from "./commands/admin/BroadcastCommand"
import RestartCommand from "./commands/util/RestartCommand"
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
        ['authentication', 'Authentication commands'],
        ['util', 'Utility commands']
    ])
    .registerDefaults()
    .registerCommands([AddServerCommand, ExecuteCommand, AuthenticateCommand, ConfirmCommand, BroadcastCommand, RestartCommand])

client.on('ready', async () => {
    initUtils(client);
    console.log(`Logged in as ${client.user.tag}`);

    initWebhooks();
});

client.login(discordConfig.apiToken);