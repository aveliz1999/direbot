import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import Task from "../../models/Task";

export default class AnnounceCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'announce',
            aliases: ['announcecommand'],
            group: 'admin',
            memberName: 'announce',
            description: 'Announce a message in a server (with a predefined header and footer)',
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
                message: "§4§k__________§2ANNOUNCEMENT§4§k__________§r\n" +
                    args.message + '\n' +
                    "§4§k__________§2ANNOUNCEMENT§4§k__________"
            }
        });

        return message.reply('Announcement queued for execution.');
    }

}