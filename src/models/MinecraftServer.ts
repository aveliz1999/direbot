import {Table, Column, Model, PrimaryKey, CreatedAt, UpdatedAt, AutoIncrement, ForeignKey} from 'sequelize-typescript';
import StatusMessage from "./StatusMessage";

interface MinecraftServerAttributes {
    id: number,
    apiKey: string,
    name: string,
    statusChannel: string,
    chatChannel: string,
    createdAt: Date,
    updatedAt: Date
}

interface MinecraftServerCreationAttributes {
    apiKey: string,
    name: string,
    statusChannel: string,
    chatChannel: string
}

@Table
export default class MinecraftServer extends Model<MinecraftServerAttributes, MinecraftServerCreationAttributes> {

    @ForeignKey(() => StatusMessage)
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

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}