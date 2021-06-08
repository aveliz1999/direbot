import {Client} from 'discord.js-commando';
import {discordConfig} from "../config";
import AddServerCommand from "./commands/admin/AddServerCommand";
import ExecuteCommand from "./commands/admin/ExecuteCommand"
import AuthenticateCommand from "./commands/auth/AuthenticateCommand"
import ConfirmCommand from "./commands/auth/ConfirmCommand"
import BroadcastCommand from "./commands/admin/BroadcastCommand"
import RestartCommand from "./commands/util/RestartCommand"
import AddAuthenticationTaskCommand from "./commands/admin/AddAuthenticationTaskCommand"
import AnnounceCommand from "./commands/admin/AnnounceCommand"
import AddAmpDataCommand from "./commands/admin/AddAmpDataCommand";
import initSequelize from "./sequelize";
import initUtils from './util';
import initWebhooks from './webhooks';
import MysqlProvider from "./MysqlProvider";
import StartCommand from "./commands/util/StartCommand";

initSequelize();

const client = new Client({
    owner: discordConfig.owner,
    commandPrefix: discordConfig.prefix
});

client.setProvider(new MysqlProvider());

client.registry
    .registerGroups([
        ['admin', 'Administration commands'],
        ['authentication', 'Authentication commands'],
        ['util', 'Utility commands']
    ])
    .registerDefaults()
    .registerCommands([
        AddServerCommand,
        ExecuteCommand,
        AuthenticateCommand,
        ConfirmCommand,
        BroadcastCommand,
        RestartCommand,
        AddAuthenticationTaskCommand,
        AnnounceCommand,
        AddAmpDataCommand,
        StartCommand
    ])

client.on('ready', async () => {
    initUtils(client);
    console.log(`Logged in as ${client.user.tag}`);

    initWebhooks();
});

client.login(discordConfig.apiToken);