import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import AuthenticatedUser from "../../models/AuthenticatedUser";
import Task from "../../models/Task";

export default class AuthenticateCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'authenticate',
            aliases: ['auth'],
            group: 'authentication',
            memberName: 'authenticate',
            description: 'Send a confirmation code to your minecraft username',
            args: [
                {
                    key: 'username',
                    prompt: 'What is your minecraft username?',
                    type: 'string'
                }
            ]
        })
    }


    async run(message: CommandoMessage, args: {username: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const server = await MinecraftServer.findOne({
            where: {
                commandsChannel: message.channel.id
            }
        });
        if(!server) {
            return message.reply('This is not a commands channel');
        }

        let existingUser = await AuthenticatedUser.findOne({
            where: {
                serverId: server.id,
                discordId: message.author.id
            }
        });
        if(existingUser && existingUser.minecraftUuid) {
            return message.reply('You are already authenticated on this server!');
        }
        if(!existingUser) {
            existingUser = await AuthenticatedUser.create({
                serverId: server.id,
                discordId: message.author.id,
                confirmationCode: generateCode(5),
                minecraftUsername: args.username
            });
        }
        else {
            existingUser = await existingUser.update({
                confirmationCode: generateCode(5),
                minecraftUsername: args.username
            })
        }

        await Task.create({
            serverId: server.id,
            apiKey: server.apiKey,
            task: {
                type: 'whisper',
                target: args.username,
                message: `§2[DireBot]:§r Your confirmation code is: ${existingUser.confirmationCode}.\n` +
                    'Type he following line in discord to finish your authentication:\n' +
                    `direbot confirm ${existingUser.confirmationCode}`
            }
        });

        await message.channel.send(
            'A confirmation code has been whispered to you in Minecraft. ' +
            'If you were not logged in to the server, please log in and run the command again. ' +
            'Once you receive the code you can follow the instructions and send a message here that says: \n' +
            'direbot confirm <code>\n' +
            'Replacing <code> with the actual code that was whispered to you'
        );
    }

}

function generateCode(length) {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}