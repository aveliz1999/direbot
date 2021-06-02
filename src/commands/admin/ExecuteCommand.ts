import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import Task from "../../models/Task";

export default class AddServerCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'execute',
            aliases: ['executecommand'],
            group: 'admin',
            memberName: 'execute',
            description: 'Execute a command in a server',
            args: [
                {
                    key: 'command',
                    prompt: 'What command to execute? No initial slash',
                    type: 'string'
                }
            ]
        })
    }


    async run(message: CommandoMessage, args: {command: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const channelManager = message.guild.channels;

        const server = await MinecraftServer.findOne({
            where: {
                adminChannel: message.channel.id
            }
        });
        if(!server) {
            return message.reply('This is not an admin commands channel');
        }

        await Task.create({
            serverId: server.id,
            apiKey: server.apiKey,
            task: {
                type: 'command',
                command: args.command
            }
        });

        return message.reply('Command queued for execution.');
    }

}