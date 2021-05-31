import {Sequelize} from 'sequelize-typescript';
import {databaseConfig} from '../config';
import MinecraftServer from "./models/MinecraftServer";
import StatusMessage from "./models/StatusMessage";

const sequelize =  new Sequelize({
    ...databaseConfig
});

export default () => {
    sequelize.addModels([MinecraftServer, StatusMessage]);
    return sequelize;
};