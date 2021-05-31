import fs from "fs";
import path from "path";
import yaml from "yaml";
import {Dialect} from "sequelize";

type DiscordConfig = {
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

export const discordConfig: DiscordConfig = yaml.parse(fs.readFileSync(path.resolve(__dirname, 'discord.yaml'), 'utf-8'));
export const databaseConfig: DatabaseConfig = yaml.parse(fs.readFileSync(path.resolve(__dirname, 'database.yaml'), 'utf-8'));
