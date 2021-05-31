import {CommandoClient} from "discord.js-commando";
import {APIMessageContentResolvable, MessageEmbed, Snowflake, TextChannel} from "discord.js";

let client: CommandoClient;

export default function init(initClient: CommandoClient) {
    client = initClient;
}

export async function sendMessage(channelId: Snowflake, content: APIMessageContentResolvable | MessageEmbed) {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    return await channel.send(content);
}

export async function deleteMessage(channelId: Snowflake, messageId: Snowflake) {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    const message = await channel.messages.fetch(messageId);
    return await message.delete();
}