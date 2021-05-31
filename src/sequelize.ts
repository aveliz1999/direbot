import {Sequelize} from 'sequelize-typescript';
import {databaseConfig} from '../config';
import MinecraftServer from "./models/MinecraftServer";

const sequelize =  new Sequelize({
    ...databaseConfig
});

export default () => {
    sequelize.addModels([MinecraftServer]);
    return sequelize;
};