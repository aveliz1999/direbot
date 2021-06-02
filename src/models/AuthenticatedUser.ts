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

interface AuthenticatedUserAttributes {
    id: number,
    serverId: number,
    minecraftUuid: string,
    minecraftUsername: string,
    discordId: string,
    confirmationCode: string,
    createdAt: Date,
    updatedAt: Date
}

interface AuthenticatedUserCreationAttributes {
    serverId: number,
    minecraftUuid?: string,
    minecraftUsername: string,
    discordId: string,
    confirmationCode: string
}

@Table
export default class AuthenticatedUser extends Model<AuthenticatedUserAttributes, AuthenticatedUserCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    serverId: number;

    @HasOne(() => MinecraftServer)
    server: MinecraftServer

    @Column
    minecraftUuid: string

    @Column
    minecraftUsername: string

    @Column
    discordId: string

    @Column
    confirmationCode: string

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}