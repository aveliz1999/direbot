import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import Task from "../../models/Task";

export default class BroadcastCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'broadcast',
            aliases: ['broadcastcommand'],
            group: 'admin',
            memberName: 'broadcast',
            description: 'Broadcast a message in a server',
            args: [
                {
                    key: 'message',
                    prompt: 'What message to broadcast?',
                    type: 'string'
                }
            ]
        })
    }


    async run(message: CommandoMessage, args: {message: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
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
                type: 'broadcast',
                message: args.message
            }
        });

        return message.reply('Broadcast queued for execution.');
    }

}