import fs from "fs";
import path from "path";
import yaml from "yaml";
import {Dialect} from "sequelize";

export type DiscordConfig = {
    apiToken: string,
    owner: string,
    prefix: string,
}

export type DatabaseConfig = {
    username: string,
    password: string,
    database: string,
    host: string,
    dialect: Dialect
}

export type WebhooksConfig = {
    webhooksDomain: string
}

export const discordConfig: DiscordConfig = yaml.parse(fs.readFileSync(path.resolve(__dirname, 'discord.yaml'), 'utf-8'));
export const databaseConfig: DatabaseConfig = yaml.parse(fs.readFileSync(path.resolve(__dirname, 'database.yaml'), 'utf-8'));
export const webhooksConfig: WebhooksConfig = yaml.parse(fs.readFileSync(path.resolve(__dirname, 'webhooks.yaml'), 'utf-8'));
