import {
    Table,
    Column,
    Model,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
    HasOne, DataType
} from 'sequelize-typescript';
import MinecraftServer from "./MinecraftServer";
import {TaskType} from "../util";

interface TaskAttributes {
    id: number,
    apiKey: string,
    serverId: number,
    task: TaskType,
    createdAt: Date,
    updatedAt: Date
}

interface TaskCreationAttributes {
    apiKey: string,
    serverId: number,
    task: TaskType,
}

@Table
export default class Task extends Model<TaskAttributes, TaskCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    apiKey: string;

    @Column
    serverId: number;

    @HasOne(() => MinecraftServer)
    server: MinecraftServer

    @Column({
        type: DataType.JSON
    })
    task: TaskType;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}