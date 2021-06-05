import {Sequelize} from 'sequelize-typescript';
import {databaseConfig} from '../config';
import MinecraftServer from "./models/MinecraftServer";
import StatusMessage from "./models/StatusMessage";
import Task from "./models/Task";
import AuthenticatedUser from "./models/AuthenticatedUser";
import AuthenticationCommand from "./models/AuthenticationCommand";
import GuildSettings from "./models/GuildSettings"

const sequelize =  new Sequelize({
    ...databaseConfig
});

export default () => {
    sequelize.addModels([
        MinecraftServer,
        StatusMessage,
        Task,
        AuthenticatedUser,
        AuthenticationCommand,
        GuildSettings
    ]);
    return sequelize;
};