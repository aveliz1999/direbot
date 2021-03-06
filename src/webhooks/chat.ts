import express from 'express';
import Joi from 'joi';
import MinecraftServer from "../models/MinecraftServer";
import {getDiscordUserFromId, sendMessage} from "../util";
import {MessageEmbed} from "discord.js";
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
        minecraftUsername: Joi.string()
            .min(3)
            .max(16)
            .required(),
        minecraftUuid: Joi.string()
            .uuid()
            .required(),
        message: Joi.string()
            .max(256)
            .required()
    });

    try{
        const data: {
            serverId: number,
            minecraftUsername: string,
            minecraftUuid: string,
            message: string
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

        const authenticated = await AuthenticatedUser.findOne({
            where: {
                serverId: server.id,
                minecraftUuid: data.minecraftUuid
            }
        });

        let embed = new MessageEmbed()
            .addField('Minecraft', data.minecraftUsername, true);
        if(authenticated) {
            const discordUser = await getDiscordUserFromId(authenticated.discordId, server.commandsChannel);
            embed = embed.addField('Discord', discordUser)
                .setColor(discordUser.roles.highest.hexColor)
        }
        embed = embed
            .addField('Text', data.message, false)
            .setThumbnail(`https://minotar.net/avatar/${data.minecraftUsername}.png`);

        try{
            await sendMessage(server.chatChannel, embed);
        }
        catch(err) {
            console.error(err);
        }

        return res.status(200).send({message: 'Sent message'});
    }
    catch(err) {
        console.error(err);
        return res.status(500).send({message: 'Error'});
    }
});

export default router;