export class Lobby {
    // uids for each user in the lobby
    protected _mem: Set<bigint>; // list of members
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

    public get time(): number {
        return this._time;
    }

    public get started(): boolean {
        return this._started;
    }

    public get id(): number {
        return this._id;
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

    start(uid: bigint): number {
        const host = this._mem.values().next().value;
        if(uid != host) {
            console.log(uid, host);
            return 1;
        }
        this._started = true;
        return 0;
    }

    desc(): string {
        return `Lobby ${this._id} created <t:${this._time}:R> has ${this._mem.size} members with host <@${this._mem.values().next().value}>.`;
    }
}