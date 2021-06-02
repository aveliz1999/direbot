import {Table, Column, Model, PrimaryKey, CreatedAt, UpdatedAt, AutoIncrement, ForeignKey} from 'sequelize-typescript';
import StatusMessage from "./StatusMessage";
import Task from "./Task";

interface MinecraftServerAttributes {
    id: number,
    apiKey: string,
    name: string,
    statusChannel: string,
    chatChannel: string,
    commandsChannel: string,
    adminChannel: string,
    createdAt: Date,
    updatedAt: Date
}

interface MinecraftServerCreationAttributes {
    apiKey: string,
    name: string,
    statusChannel: string,
    chatChannel: string,
    commandsChannel: string,
    adminChannel: string
}

@Table
export default class MinecraftServer extends Model<MinecraftServerAttributes, MinecraftServerCreationAttributes> {

    @ForeignKey(() => StatusMessage)
    @ForeignKey(() => Task)
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    apiKey: string;

    @Column
    name: string;

    @Column
    statusChannel: string;

    @Column
    chatChannel: string;

    @Column
    commandsChannel: string

    @Column
    adminChannel: string

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}