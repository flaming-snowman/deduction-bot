import { Lobby } from './lobby'
import { Avalon } from './avalon'
import { Rotate } from './rotate'

class guildLobby {
    private lobbies: Map<number, Lobby>; // map of lobby id: lobby object
    private msgmap: Map<bigint, number>; // map of msgid: lobby id
    private threadmap: Map<bigint, number>; // map of threadid: lobby id
    private nextID: number; // used to allocate new IDs

    constructor() {
        this.lobbies = new Map<number, Lobby>();
        this.msgmap = new Map<bigint, number>();
        this.threadmap = new Map<bigint, number>();
        this.nextID = 1;
    }
    
    list(): string {
        if(this.lobbies.size == 0) {
            return "There are no active lobbies";
        }
        let s: string = "";
        for(let value of this.lobbies.values()) {
            s += value.desc() + '\n';
        }
        return s.slice(0, -1);
    }

    has(id: number): boolean {
        return this.lobbies.has(id);
    } 

    get(id: number): Lobby | undefined {
        return this.lobbies.get(id);
    }

    add(host: bigint): number {
        this.lobbies.set(this.nextID, new Lobby(this.nextID, host));
        this.nextID++;
        return this.nextID-1;
    }

    addAvalon(host: bigint): number {
        this.lobbies.set(this.nextID, new Avalon(this.nextID, host));
        this.nextID++;
        return this.nextID-1;
    }

    addRotate(host: bigint): number {
        this.lobbies.set(this.nextID, new Rotate(this.nextID, host));
        this.nextID++;
        return this.nextID-1;
    }

    del(id: number): boolean {
        return this.lobbies.delete(id);
        // returns false if lobby does not exist
    }

    updateMsgMap(msgid: bigint, id: number): void {
        this.msgmap.set(msgid, id);
    }

    getFromMsg(msgid: bigint): number | undefined {
        return this.msgmap.get(msgid);
    }

    updateThreadMap(threadid: bigint, id: number): void {
        this.threadmap.set(threadid, id);
    }

    getFromThread(threadid: bigint): number | undefined {
        return this.threadmap.get(threadid);
    }
}

export const GLOBBY = {
    // map of gid: lobbies
    globbies: new Map<bigint, guildLobby>(),

    add(gid: bigint): void {
        this.globbies.set(gid, new guildLobby());
    },

    has(gid: bigint): boolean {
        return this.globbies.has(gid);
    }, 

    get(gid: bigint): guildLobby {
        if(!this.has(gid)) {
            this.add(gid)
        }
        return this.globbies.get(gid)!;
    },

    del(gid: bigint): boolean {
        return this.globbies.delete(gid);
        // returns false if lobby does not exist
    }
};