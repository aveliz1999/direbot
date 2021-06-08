import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";

export default class AddAmpDataCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'addampdata',
            aliases: ['add-amp-data'],
            group: 'admin',
            memberName: 'addampdata',
            description: 'Add amp data to a server',
            args: [
                {
                    key: 'endpoint',
                    prompt: 'What is the URL endpoint?',
                    type: 'string'
                },
                {
                    key: 'username',
                    prompt: 'What is the amp username?',
                    type: 'string'
                },
                {
                    key: 'password',
                    prompt: 'What is the amp password?',
                    type: 'string'
                }
            ]
        })
    }


    async run(message: CommandoMessage, args: {endpoint: string, username: string, password: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const server = await MinecraftServer.findOne({
            where: {
                adminChannel: message.channel.id
            }
        });
        if(!server) {
            return message.reply('This is not an admin commands channel');
        }

        await MinecraftServer.update({
            ampServerEndpoint: args.endpoint,
            ampServerUsername: args.username,
            ampServerPassword: args.password
        }, {
            where: {
                id: server.id
            }
        });

        return message.reply('Updated the server\'s amp data');
    }

}