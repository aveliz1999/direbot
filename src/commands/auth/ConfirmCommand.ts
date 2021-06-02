import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import AuthenticatedUser from "../../models/AuthenticatedUser";
import StatusMessage from "../../models/StatusMessage";

export default class AddServerCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'confirm',
            aliases: ['con'],
            group: 'authentication',
            memberName: 'confirm',
            description: 'Confirm the code that was whispered to your minecraft character',
            args: [
                {
                    key: 'code',
                    prompt: 'What is the confirmation code that was whispered to your minecraft character?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message: CommandoMessage, args: {code: string}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
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
        if(!existingUser || existingUser.minecraftUuid) {
            return message.reply('No existing confirmation waiting.');
        }
        if(existingUser.confirmationCode !== args.code) {
            return message.reply('Incorrect code. Please try again!');
        }

        const online = await StatusMessage.findOne({
            where: {
                serverId: server.id,
                minecraftUsername: existingUser.minecraftUsername
            }
        });
        if(!online) {
            return message.reply('No online player found to pair to. You must be online for this step!');
        }

        await existingUser.update({
            minecraftUuid: online.minecraftUuid
        });

        // TODO add the role to the user
        //await message.guild.member(message.author).roles.add(server.authenticatedRole);
        await message.channel.send('Successfully authenticated! The authenticated role has been added to you.');
    }

}