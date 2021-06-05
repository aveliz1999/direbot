import {
    Table,
    Column,
    Model,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
    DataType
} from 'sequelize-typescript';

interface GuildSettingsAttributes {
    id: number,
    guildId: string,
    settings: Settings,
    createdAt: Date,
    updatedAt: Date
}

interface GuildSettingsCreationAttributes {
    guildId: string,
    settings: Settings,
}

type Settings = {
    [key: string]: any
}

@Table
export default class GuildSettings extends Model<GuildSettingsAttributes, GuildSettingsCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    guildId: string;

    @Column({
        type: DataType.JSON,
        get(this: GuildSettings) {
            if(typeof this.getDataValue('settings') == 'string') {
                // @ts-ignore
                return JSON.parse(this.getDataValue('settings'));
            }
            return this.getDataValue('settings')
        }
    })
    settings: Settings;

    @CreatedAt
    @Column
    createdAt: Date;

    @UpdatedAt
    @Column
    updatedAt: Date;
}