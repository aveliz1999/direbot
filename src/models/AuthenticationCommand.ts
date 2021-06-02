import {
    Table,
    Column,
    Model,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
    HasOne
} from 'sequelize-typescript';
import MinecraftServer from "./MinecraftServer";

interface AuthenticationCommandAttributes {
    id: number,
    serverId: number,
    command: string,
    createdAt: Date,
    updatedAt: Date
}

interface AuthenticationCommandCreationAttributes {
    serverId: number,
    command: string
}

@Table
export default class AuthenticationCommand extends Model<AuthenticationCommandAttributes, AuthenticationCommandCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    serverId: number;

    @HasOne(() => MinecraftServer)
    server: MinecraftServer

    @Column
    command: string

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}