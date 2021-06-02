import express from 'express';
import Joi from 'joi';
import MinecraftServer from "../models/MinecraftServer";
import {deleteMessage, getDiscordUserFromId, sendMessage} from "../util";
import {MessageEmbed} from "discord.js";
import StatusMessage from "../models/StatusMessage";
import validApiKey from "./middleware/validApiKey";
import AuthenticatedUser from "../models/AuthenticatedUser";

const router = express.Router();
router.use(validApiKey);

router.post('/', async (req, res) => {
    const schema = Joi.object({
        serverId: Joi.number()
            .integer()
            .positive()
            .required(),
        players: Joi.array()
            .allow(Joi.object({
                minecraftUsername: Joi.string()
                    .min(3)
                    .max(16)
                    .required(),
                minecraftUuid: Joi.string()
                    .uuid()
                    .required()
            }))
    });

    try{
        const data: {
            serverId: number,
            players: {
                minecraftUsername: string,
                minecraftUuid: string
            }[]
        } = await schema.validateAsync(req.body);

        const server = await MinecraftServer.findOne({
            where: {
                id: data.serverId
            }
        });
        if(!server) {
            return res.status(404).send({message: 'No server with that ID found.'});
        }

        if(server.apiKey !== req.apiKey) {
            return res.status(401).send({message: 'Invalid API key'});
        }

        const messages = await StatusMessage.findAll({
            where: {
                serverId: server.id
            }
        });
        const messageIds = messages.map(m => m.minecraftUuid);

        const playerIds = data.players.map(p => p.minecraftUuid);

        const left = messages.filter(m => !playerIds.includes(m.minecraftUuid));
        try {
            await Promise.all(left.map(leftPlayer => deleteMessage(server.statusChannel, leftPlayer.messageId)));
            await Promise.all(left.map(leftPlayer => leftPlayer.destroy()));
        }
        catch(err) {
            console.error(err);
        }

        const newPlayers = data.players.filter(p => !messageIds.includes(p.minecraftUuid));

        const authenticatedUsers: AuthenticatedUser[] = (await Promise.all(newPlayers.map(p => AuthenticatedUser.findOne({
            where: {
                serverId: server.id,
                minecraftUuid: p.minecraftUuid
            }
        })))).filter(x => !!x);


        for(let {minecraftUsername, minecraftUuid} of newPlayers) {
            let embed = new MessageEmbed()
                .addField('Minecraft', minecraftUsername, false)
                .setThumbnail(`https://minotar.net/avatar/${minecraftUsername}.png`);
            const authenticated = authenticatedUsers.find(u => u.minecraftUuid == minecraftUuid);
            if(authenticated) {
                const discordUser = await getDiscordUserFromId(authenticated.discordId, server.commandsChannel);
                embed = embed.addField('Discord', discordUser)
                    .setColor(discordUser.roles.highest.color);
            }

            try{
                const message = await sendMessage(server.statusChannel, embed);
                await StatusMessage.create({
                    serverId: server.id,
                    apiKey: server.apiKey,
                    minecraftUsername,
                    minecraftUuid,
                    channelId: server.statusChannel,
                    messageId: message.id
                })
            }
            catch(err) {
                console.error(err);
            }
        }

        return res.status(200).send({message: 'Sent message'});
    }
    catch(err) {
        console.error(err);
        return res.status(500).send({message: 'Error'});
    }
});

export default router;