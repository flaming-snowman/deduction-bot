class Lobby {
    // uids for each user in the lobby
    private _mem: Set<bigint>; // list of members
    private _time: number;
    private _started: boolean;
    private _id: number;

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

    desc(): string {
        return `Lobby ${this._id} created <t:${this._time}:R> has ${this._mem.size} members with host <@${this._mem.values().next().value}>.`;
    }
}

class guildLobby {
    // map of id: lobbies
    private lobbies: Map<number, Lobby>;
    private nextID: number; // used to allocate new IDs

    constructor() {
        this.lobbies = new Map<number, Lobby>();
        this.nextID = 1;
    }
    
    list(): string {
        let s: string = "";
        for(let value of this.lobbies.values()) {
            s += value.desc() + '\n';
        }
        return s.slice(0, -1);
    }

    has(id: number): boolean {
        return this.lobbies.has(id);
    } 

    get(id: number): Lobby {
        return this.lobbies.get(id);
    }

    add(host: bigint): number {
        this.lobbies.set(this.nextID, new Lobby(this.nextID, host));
        this.nextID++;
        return this.nextID-1;
    }

    del(id: number): boolean {
        return this.lobbies.delete(id);
        // returns false if lobby does not exist
    }
}

export const gLobby = {
    // map of gid: lobbies
    globbies: new Map<bigint, guildLobby>(),

    add(gid: bigint): void {
        this.globbies.set(gid, new guildLobby());
    },

    has(gid: bigint): boolean {
        return this.globbies.has(gid);
    }, 

    get(gid: bigint): guildLobby {
        return this.globbies.get(gid);
    },

    del(gid: bigint): boolean {
        return this.globbies.delete(gid);
        // returns false if lobby does not exist
    }
};