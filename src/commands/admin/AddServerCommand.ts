import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import {CategoryChannel, Role, TextChannel} from 'discord.js';
import MinecraftServer from "../../models/MinecraftServer";
import {randomBytes} from 'crypto';
import {promisify} from "util";
import {webhooksConfig} from "../../../config";

export default class AddServerCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'addserver',
            aliases: ['add-server'],
            group: 'admin',
            memberName: 'addserver',
            description: 'Add a new server',
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'name',
                    prompt: 'What is the name of the new server?',
                    type: 'string'
                },
                {
                    key: 'authenticatedRole',
                    prompt: 'What is the authenticated role for this server?',
                    type: 'role'
                }
            ]
        })
    }


    async run(message: CommandoMessage, args: {name: string, authenticatedRole: Role}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const channelManager = message.guild.channels;

        let category: CategoryChannel;
        let statusChannel: TextChannel;
        let chatChannel: TextChannel;
        let apiKey: string;

        try {
            category = await channelManager.create(args.name, {
                type: 'category'
            });
        }
        catch(err) {
            return message.reply('Error occurred while creating the category');
        }

        try {
            statusChannel = await channelManager.create('Status', {
                type: 'text',
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: ['SEND_MESSAGES'],
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                    },
                    {
                        id: this.client.user.id,
                        allow: ['SEND_MESSAGES']
                    }
                ]
            });
        }
        catch(err) {
            return message.reply('Error occurred while creating the status channel');
        }


        try {
            chatChannel = await channelManager.create('Game-Chat', {
                type: 'text',
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: ['SEND_MESSAGES'],
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                    },
                    {
                        id: args.authenticatedRole.id,
                        allow: ['SEND_MESSAGES']
                    },
                    {
                        id: this.client.user.id,
                        allow: ['SEND_MESSAGES']
                    }
                ]
            });
        }
        catch(err) {
            return message.reply('Error occurred while creating the chat channel');
        }

        try{
            const generated = await promisify(randomBytes)(12);
            apiKey = generated.toString('base64');
        }
        catch(err) {
            return message.reply('Error occurred while generating the API key');
        }

        let server: MinecraftServer;
        try {
            server = await MinecraftServer.create({
                apiKey,
                name: args.name,
                statusChannel: statusChannel.id,
                chatChannel: chatChannel.id
            })
        }
        catch(err) {
            return message.reply('Error occurred while creating the database entry');
        }

        let webhookEndpoint = webhooksConfig.webhooksDomain;
        if(webhookEndpoint.endsWith('/')) {
            webhookEndpoint = webhookEndpoint.substring(0, webhookEndpoint.length - 1);
        }

        return message.reply('Successfully created the new server\n' +
            `Your server ID is: \`${server.id}\`\n` +
            `Your api key: \`${server.apiKey}\`\n` +
            `Webhook endpoint for chat: ${webhookEndpoint}/chat\n` +
            `Webhook endpoint for status: ${webhookEndpoint}/status`);
    }

}