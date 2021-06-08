import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import {startServer} from "../../amp/amp";

export default class StartCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'start',
            aliases: ['s'],
            group: 'util',
            memberName: 'start',
            description: 'Initiate a server start vote'
        })
    }


    async run(message: CommandoMessage, args: {message: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const server = await MinecraftServer.findOne({
            where: {
                commandsChannel: message.channel.id
            }
        });
        if(!server) {
            return message.reply('This is not a commands channel');
        }

        await startServer(server);
    }

}