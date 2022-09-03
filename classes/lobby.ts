import { AnyThreadChannel, Colors, EmbedBuilder } from "discord.js";
import { GLOBBY } from "./globby";

export class Lobby {
    // uids for each user in the lobby
    protected _mem: Set<bigint>; // list of members
    private _time: number;
    private _started: boolean;
    private _id: number;
    protected _name: string = "NOT IMPLEMENTED";
    protected _thread?: AnyThreadChannel;
    protected _nameMap?: Map<bigint, string>;

    constructor(num: number, host: bigint) {
        this._mem = new Set<bigint>();
        this._mem.add(host);
        this._id = num;
        this._time = Math.floor(Date.now()/1000);
        this._started = false;
    }

    public get mem(): Set<bigint> {
        return this._mem;
    }

    public get time(): number {
        return this._time;
    }

    public get started(): boolean {
        return this._started;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    host(): bigint {
        return this._mem.values().next().value
    }

    list(): string {
        let s = "";
        for(const p of this._mem) {
            s += `<@${p}>\n`;
        }
        return s.slice(0, -1);
    }

    memberJoin(uid: bigint): boolean {
        //returns true if member added to lobby
        //returns false if member already in lobby
        if(this._mem.has(uid)) return false;
        this._mem.add(uid);
        return true;
    }

    memberLeave(uid: bigint): boolean {
        //returns true if member removed from lobby
        //returns false if member not in lobby to begin with
        return this._mem.delete(uid);
    }

    updateMembers(members: Map<bigint, string>): void {
        this._nameMap = members;
    }

    start(uid: bigint): number {
        const host = this.host();
        if(uid != host) {
            return 1;
        }
        this._started = true;
        return 0;
    }

    desc(): string {
        return `Lobby ${this._id} created <t:${this._time}:R> has ${this._mem.size} members with host <@${this.host()}>.`;
    }

    getEmbed(): EmbedBuilder {
        const embed = new EmbedBuilder()
        .setTitle(`Lobby ${this.id} - ${this.name}`)
        .addFields(
            { name: 'Host', value: `<@${this.host()}>`, inline: true },
            { name: 'Created', value: `<t:${this._time}:R>`, inline: true },
            { name: 'Size', value: `${this._mem.size}`, inline: true },
            { name: 'Members', value: this.list() },
        )
        .setColor(Colors.Yellow);

        return embed;
    }

    setup(thread: AnyThreadChannel): void {
        this._thread = thread;
        GLOBBY.get(BigInt(thread.guildId)).updateThreadMap(BigInt(thread.id), this._id);
        /*
        let mentionMembers = "";
        this._mem!.forEach(x => mentionMembers += `<@${x}>`);
        thread.send({ content: mentionMembers });
        */
    }

    getRole(uid: bigint): string | undefined {
        return "NOT IMPLEMENTED";
    }
}