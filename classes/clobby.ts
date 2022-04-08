class Lobby {
    // uids for each user in the lobby
    mem: Set<bigint>; // list of members
    time: number;
    started: boolean;
    private id: number;
    constructor(num: number, host: bigint) {
        this.mem = new Set<bigint>();
        this.mem.add(host);
        this.id = num;
        this.time = Math.floor(Date.now()/1000);
        this.started = false;
    }

    desc(): string {
        return `Lobby ${this.id} created <t:${this.time}:R> has ${this.mem.size} members with host <@${this.mem.values().next().value}>.`;
    }
}

class guildLobby {
    // map of id: lobbies
    lobbies: Map<number, Lobby>;
    private nextID: number; // used to allocate new IDs

    constructor() {
        this.lobbies = new Map<number, Lobby>();
        this.nextID = 1;
    }
    
    list() {
        let s: string = "";
        for(let value of this.lobbies.values()) {
            s += value.desc() + '\n';
        }
        return s.slice(0, -1);
    }

    add(host: bigint): number {
        this.lobbies.set(this.nextID, new Lobby(this.nextID, host));
        this.nextID++;
        return this.nextID-1;
    }

    remove(id: number): boolean {
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

    remove(gid: bigint): boolean {
        return this.globbies.delete(gid);
    }
};