import {Table, Column, Model, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';

interface MinecraftServerAttributes {
    apiKey: string,
    name: string,
    statusChannel: string,
    chatChannel: string
}

@Table
export default class MinecraftServer extends Model<MinecraftServerAttributes> {

    @PrimaryKey
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