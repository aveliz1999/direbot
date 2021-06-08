import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import Task from "../../models/Task";
import {Collection, MessageEmbed, MessageReaction, Snowflake} from "discord.js";
import AuthenticatedUser from "../../models/AuthenticatedUser";
import {killServer} from "../../amp/amp";

export default class KillCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'kill',
            aliases: ['k'],
            group: 'util',
            memberName: 'kill',
            description: 'Initiate a server kill vote'
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

        let embed = new MessageEmbed()
            .addField('Voting started', 'Please press the ✅ icon to vote yes, and the ❌ to vote no', false)
            .addField('Requirement', 'Only authenticated users are counted', false)
            .addField('Required Votes', `More yes no than no votes`, false)
            .addField('⚠️WARNING⚠️', `Only vote yes if the server has crashed and is not coming back up. This can cause data loss.`, false)
            .addField('Waiting...', 'The vote will end in 1 minute', false)
            .setColor('23b604');
        const sentMessage = await message.channel.send(embed);

        await Task.create({
            serverId: server.id,
            apiKey: server.apiKey,
            task: {
                type: 'broadcast',
                message: "§4§k__________§2ANNOUNCEMENT§4§k__________§r\n" +
                    "A kill vote has started!\n" +
                    `§2More yes votes than no votes must be cast in order for it to work\n` +
                    `Please go to the ${server.name} commands channel to vote yes or no!\n` +
                    "§4§k__________§2ANNOUNCEMENT§4§k__________"
            }
        });

        sentMessage.awaitReactions(
            (reaction, user) => reaction.emoji.name == '✅' || reaction.emoji.name == '❌', {
                time: 60000
            })
            .then(async (reactions: Collection<Snowflake, MessageReaction>)  => {
                const responses = reactions.map((reaction, snowflake) => {
                    return {
                        emoji: reaction.emoji,
                        users: reaction.users,
                    }
                });
                const yesResponses = await responses.find(res => res.emoji.name == '✅').users.fetch();
                const authenticatedYesResponses = (await Promise.all(
                    yesResponses.map(u => AuthenticatedUser.findOne({where: {discordId: u.id}}))
                )).filter(u => !!u);

                const noResponses = await responses.find(res => res.emoji.name == '❌').users.fetch();
                const authenticatedNoResponses = (await Promise.all(
                    noResponses.map(u => AuthenticatedUser.findOne({where: {discordId: u.id}}))
                )).filter(u => !!u);


                const resultsEmbed = new MessageEmbed()
                    .addField('Yes Votes', authenticatedYesResponses.length, false)
                    .addField('No Votes', authenticatedNoResponses.length, false)
                    .addField('Result', (authenticatedYesResponses.length > authenticatedNoResponses.length) ? 'Killing...' : 'Not killing')
                    .setColor((await message.guild.members.fetch(this.client.user)).roles.highest.color);
                await message.channel.send(resultsEmbed);
                if(authenticatedYesResponses.length > authenticatedNoResponses.length) {
                    await killServer(server);
                }
            });
        await sentMessage.react('✅');
        await sentMessage.react('❌');
    }

}