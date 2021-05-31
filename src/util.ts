import {CommandoClient} from "discord.js-commando";
import {APIMessageContentResolvable, Snowflake, TextChannel} from "discord.js";

let client: CommandoClient;

export default function init(initClient: CommandoClient) {
    client = initClient;
}

export async function sendMessage(channelId: Snowflake, content: APIMessageContentResolvable) {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    await channel.send(content);
}