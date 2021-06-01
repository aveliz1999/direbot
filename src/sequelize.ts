import {Sequelize} from 'sequelize-typescript';
import {databaseConfig} from '../config';
import MinecraftServer from "./models/MinecraftServer";
import StatusMessage from "./models/StatusMessage";
import Task from "./models/Task";

const sequelize =  new Sequelize({
    ...databaseConfig
});

export default () => {
    sequelize.addModels([MinecraftServer, StatusMessage, Task]);
    return sequelize;
};