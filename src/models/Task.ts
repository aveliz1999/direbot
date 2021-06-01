import {
    Table,
    Column,
    Model,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
    ForeignKey,
    HasOne, DataType
} from 'sequelize-typescript';
import StatusMessage from "./StatusMessage";
import MinecraftServer from "./MinecraftServer";
import {CommandTask, WhisperTask} from "../util";

interface TaskAttributes {
    id: number,
    apiKey: string,
    serverId: string,
    task: WhisperTask | CommandTask,
    createdAt: Date,
    updatedAt: Date
}

interface TaskCreationAttributes {
    apiKey: string,
    serverId: string,
    task: WhisperTask | CommandTask,
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
    task: WhisperTask | CommandTask;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}