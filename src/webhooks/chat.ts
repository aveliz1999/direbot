import express from 'express';
import Joi from 'joi';
import MinecraftServer from "../models/MinecraftServer";
import {sendMessage} from "../util";
import {MessageEmbed} from "discord.js";

const router = express.Router();

router.post('/', async (req, res) => {
    console.log(req.body);
    const schema = Joi.object({
        serverId: Joi.number()
            .integer()
            .positive()
            .required(),
        apiKey: Joi.string()
            .length(16)
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
            apiKey: string,
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

        if(server.apiKey !== data.apiKey) {
            return res.status(401).send({message: 'Invalid API key'});
        }

        const embed = new MessageEmbed()
            .addField('Minecraft', data.minecraftUsername, true)
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