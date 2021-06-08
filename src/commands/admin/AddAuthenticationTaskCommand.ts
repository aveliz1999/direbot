import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import AuthenticationCommand from "../../models/AuthenticationCommand";

export default class AddAuthenticationTaskCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'addauthenticationtask',
            aliases: ['aut', 'addtask'],
            group: 'admin',
            memberName: 'addauthenticationtask',
            description: 'Add a command to be executed when a user authenticates',
            args: [
                {
                    key: 'command',
                    prompt: 'What command to execute? No initial slash. {USER} will be replaced by their actual username',
                    type: 'string'
                }
            ]
        })
    }


    async run(message: CommandoMessage, args: {command: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const server = await MinecraftServer.findOne({
            where: {
                adminChannel: message.channel.id
            }
        });
        if(!server) {
            return message.reply('This is not an admin commands channel');
        }

        await AuthenticationCommand.create({
            serverId: server.id,
            command: args.command
        });

        return message.reply('Created the authentication command');
    }

}