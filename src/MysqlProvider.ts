import {Command, CommandGroup, CommandoClient, CommandoGuild, SettingProvider} from "discord.js-commando";
import {Guild} from "discord.js";
import GuildSettings from "./models/GuildSettings";
import {settings} from "cluster";

export default class MysqlProvider extends SettingProvider {

    client: CommandoClient;
    settings: Map<string, any> = new Map();
    listeners = new Map();

    async init(client: CommandoClient) {
        this.client = client;

        let databaseSettings: GuildSettings[];
        try{
            databaseSettings = await GuildSettings.findAll();
        }
        catch(err) {
            this.client.emit('error', new Error('MysqlProvider could not load the settings'));
        }

        for(let setting of databaseSettings) {
            this.settings.set(setting.guildId, setting.settings);
            this.setupGuild(this.client.guilds.cache.get(setting.guildId) as CommandoGuild, setting.settings);
        }

        this.listeners
            .set('commandPrefixChange', (guild: CommandoGuild, prefix: string) => {
                this.set(guild, 'prefix', prefix);
            })
            .set('commandStatusChange', (guild: CommandoGuild, command: Command, enabled: boolean) => {
                this.set(guild, `command_settings--${command.group.id}-${command.name}`, enabled)
            })
            .set('groupStatusChange', (guild: CommandoGuild, group: CommandGroup, enabled: boolean) => {
                this.set(guild, `group_settings--${group.id}`, enabled)
            })
            .set('guildCreate', (guild: CommandoGuild) => {
                const settings = this.settings.get(guild.id);
                if(!settings) {
                    return;
                }

                this.setupGuild(guild, settings);
            })
            .set('commandRegister', async (command: Command) => {
                for(const [guildId, settings] of this.settings) {
                    let guild = await this.getGuildFromId(guildId);
                    if(!guild) {
                        continue;
                    }

                    guild.setCommandEnabled(command, true)
                }
            })
            .set('groupRegister', async (group: CommandGroup) => {
                for (const [guildId, settings] of this.settings) {
                    let guild = await this.getGuildFromId(guildId);
                    if(!guild) {
                        continue;
                    }

                    guild.setGroupEnabled(group, true);
                }
            });

        for (const [event, listener] of this.listeners) {
            client.on(event, listener)
        }
    }

    async clear(guild: CommandoGuild | string): Promise<void> {
        await GuildSettings.update({
            settings: {}
        }, {
            where: {
                guildId: guild instanceof Guild ? guild.id : guild
            }
        })
    }

    async destroy(): Promise<void> {
        for (const [event, listener] of this.listeners) {
            this.client.removeListener(event, listener)
        }
        this.listeners.clear()
    }

    get(guild: CommandoGuild | string, key: string, defVal?: any): any {
        const setting = this.settings.get(guild instanceof Guild ? guild.id : guild);
        return setting ? setting[key] : defVal;
    }

    async remove(guild: CommandoGuild | string, key: string): Promise<any> {
        const guildId = guild instanceof Guild ? guild.id : guild;

        const setting = this.settings.get(guildId);
        delete setting[key];

        await GuildSettings.update({
            settings: setting
        }, {
            where: {
                guildId
            }
        })
    }

    async set(guild: CommandoGuild | string, key: string, val: any): Promise<any> {
        const guildId = guild instanceof Guild ? guild.id : guild;

        const setting = this.settings.get(guildId);
        if(setting) {
            setting[key] = val;

            await GuildSettings.update({
                settings: setting
            }, {
                where: {
                    guildId
                }
            })
        }
        else {
            const settings = {
                [key]: val
            }
            this.settings.set(guildId, settings);
            return GuildSettings.create({
                guildId,
                settings
            })
        }

    }

    setupGuild(guild: CommandoGuild, settings: any) {
        if(settings.prefix && guild) {
            guild.commandPrefix = settings.prefix
        }

        for(let group of this.client.registry.groups.values()) {
            if(group.guarded) {
                continue;
            }
            guild.setGroupEnabled(group, settings[`group_settings--${group.id}`] ?? true);
        }
        for(let command of this.client.registry.commands.values()) {
            if(command.guarded) {
                continue;
            }
            guild.setCommandEnabled(command, settings[`command_settings--${command.group.id}-${command.name}`] ?? true)
        }
    }

    async getGuildFromId(id: string): Promise<CommandoGuild | null> {
        if(this.client.guilds.cache.get(id)) {
            return this.client.guilds.cache.get(id) as CommandoGuild;
        }
        const fetched = await this.client.guilds.fetch(id);
        if(fetched) {
            return fetched as CommandoGuild;
        }

        return null;
    }

}