import {CommandoClient} from "discord.js-commando";
import {APIMessageContentResolvable, MessageEmbed, Snowflake, TextChannel} from "discord.js";
import Task from "./models/Task";
import MinecraftServer from "./models/MinecraftServer";

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

export type WhisperTask = {
    type: 'whisper',
    target: string,
    message: string
}

export type CommandTask = {
    type: 'command',
    command: string
}

export type BroadcastTask  = {
    type: 'broadcast',
    message: string
}

export type TaskType = WhisperTask | CommandTask | BroadcastTask

export async function addTask(serverId: number, apiKey: string, task: TaskType) {
    await Task.create({
        serverId,
        apiKey,
        task
    });
}

export async function getDiscordUserFromId(id: Snowflake, channelId: string) {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    return channel.guild.members.fetch(id);
}