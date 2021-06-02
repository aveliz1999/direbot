import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import MinecraftServer from "../../models/MinecraftServer";
import Task from "../../models/Task";
import {Collection, MessageEmbed, MessageReaction, Snowflake} from "discord.js";
import StatusMessage from "../../models/StatusMessage";
import AuthenticatedUser from "../../models/AuthenticatedUser";

export default class AddServerCommand extends Command {

    constructor(client: Client) {
        super(client, {
            name: 'restart',
            aliases: ['res'],
            group: 'util',
            memberName: 'restart',
            description: 'Initiate a server restart vote'
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

        const onlinePlayers = await StatusMessage.findAll({
            where: {
                serverId: server.id
            }
        });

        let requiredAmount;
        if(onlinePlayers.length <= 2) {
            requiredAmount = 1;
        }
        else {
            requiredAmount = Math.floor(onlinePlayers.length / 2);
        }

        const onlineAndAuthenticated: AuthenticatedUser[] = (await Promise.all(onlinePlayers.map(online => AuthenticatedUser.findOne({
            where: {
                serverId: server.id,
                minecraftUuid: online.minecraftUuid
            }
        })))).filter(x => !!x);
        const allowedIds = onlineAndAuthenticated.map(p => p.discordId);
        const allowedVoters = (await Promise.all(allowedIds.map(p => message.client.users.fetch(p)))).filter(x => !!x);

        let embed = new MessageEmbed()
            .addField('Voting started', 'Please press the ✅ icon to vote yes, and the ❌ to vote no', false)
            .addField('Requirement', 'Only authenticated users who are online on the server are counted', false)
            .addField('Required Votes', `${requiredAmount} yes votes are required to pass`, false)
            .addField('Allowed Voters', `The following people can vote:\n${allowedVoters.join('\n')}`, false)
            .addField('Waiting...', 'The vote will end in 1 minute', false)
            .setColor('23b604');
        const sentMessage = await message.channel.send(embed);

        await Task.create({
            serverId: server.id,
            apiKey: server.apiKey,
            task: {
                type: 'broadcast',
                message: "§4§k__________§2ANNOUNCEMENT§4§k__________§r\n" +
                    "A restart vote has started!\n" +
                    `§2${requiredAmount} players§r must vote yes for it to pass!\n` +
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
                console.log(allowedIds);
                const yesResponses = (await responses.find(res => res.emoji.name == '✅').users.fetch())
                    .filter((user) => allowedIds.includes(user.id));

                const noResponses = (await responses.find(res => res.emoji.name == '❌').users.fetch())
                    .filter((user) => allowedIds.includes(user.id));



                const resultsEmbed = new MessageEmbed()
                    .addField('Yes Votes', yesResponses.size, false)
                    .addField('No Votes', noResponses.size, false)
                    .addField('Yes Voters', yesResponses.map(u=>u).join('\n') || 'Nobody')
                    .addField('No Voters', noResponses.map(u=>u).join('\n') || 'Nobody')
                    .addField('Result', (yesResponses.size >= requiredAmount) ? 'Restarting...' : 'Not restarting')
                    .setColor((await message.guild.members.fetch(this.client.user)).roles.highest.color);
                await message.channel.send(resultsEmbed);
                if(yesResponses.size >= requiredAmount) {
                    await Task.create({
                        serverId: server.id,
                        apiKey: server.apiKey,
                        task: {
                            type: 'command',
                            command: 'stop'
                        }
                    });
                }
            });
        await sentMessage.react('✅');
        await sentMessage.react('❌');
    }

}