import {Table, Column, Model, PrimaryKey, CreatedAt, UpdatedAt, AutoIncrement, HasOne} from 'sequelize-typescript';
import MinecraftServer from "./MinecraftServer";

interface StatusMessageAttributes {
    id: number,
    serverId: number,
    apiKey: string,
    minecraftUsername: string,
    minecraftUuid: string,
    channelId: string,
    messageId: string,
    createdAt: Date,
    updatedAt: Date
}

interface StatusMessageCreationAttributes {
    serverId: number,
    apiKey: string,
    minecraftUsername: string,
    minecraftUuid: string,
    channelId: string,
    messageId: string
}

@Table
export default class StatusMessage extends Model<StatusMessageAttributes, StatusMessageCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    serverId: number;

    @HasOne(() => MinecraftServer)
    server: MinecraftServer

    @Column
    apiKey: string;

    @Column
    minecraftUsername: string;

    @Column
    minecraftUuid: string;

    @Column
    channelId: string;

    @Column
    messageId: string;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}