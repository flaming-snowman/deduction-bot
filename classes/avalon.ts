// This is a lot of boilerplating I'm really sorry if you try to read this
import { ActionRowBuilder, AnyThreadChannel, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Lobby } from './lobby'

class Res
{
    merl: boolean = false;
    percy: boolean = false;
    spy: boolean = false;
    ass: boolean = false;
    morg: boolean = false;
    mord: boolean = false;
    ober: boolean = false;
    name: string = "Resistance";
}

class Merl extends Res
{
    constructor() {
        super();
        this.merl = true;
        this.name = "Merlin";
    }
}

class Percy extends Res
{
    constructor() {
        super();
        this.percy = true;
        this.name = "Percival";
    }
}

class Spy extends Res
{
    constructor() {
        super();
        this.spy = true;
        this.name = "Spy";
    }
}

class Ass extends Res
{
    constructor() {
        super();
        this.spy = true;
        this.ass = true;
        this.name = "Assassin";
    }
}

class Morg extends Res
{
    constructor() {
        super();
        this.spy = true;
        this.morg = true;
        this.name = "Morgana";
    }
}

class Mord extends Res
{
    constructor() {
        super();
        this.spy = true;
        this.mord = true;
        this.name = "Mordred";
    }
}

class Ober extends Res
{
    constructor() {
        super();
        this.spy = true;
        this.ober = true;
        this.name = "Oberon";
    }
}

class Mission
{
    private fails: number = 0;
    private failsreq: number;
    constructor(mem: Set<Res>, gamesize: number, mission: number) {
        if(gamesize < 7 || mission != 4) {
            this.failsreq = 1;
        } else {
            this.failsreq = 2;
        }
        for(const r of mem.values()) {
            if(r.spy) {
                this.fails++;
            }
        }
    }
    success(): boolean {
        return this.fails < this.failsreq;
    }
    result(): string {
        const resultstr = this.success() ? "succeeded" : "failed"
        return `Mission ${resultstr} with ${this.fails} fails`;
    }
}

export class Avalon extends Lobby
{
    private minSize = 5;
    private maxSize = 10;
    private gameSize?: number;
    private roleMap?: Map<bigint, Res>;
    private msetup: number[][] =
    [
        [2,3,2,3,3],
        [2,3,4,3,4],
        [2,3,3,4,4],
        [3,4,4,5,5],
        [3,4,4,5,5],
        [3,4,4,5,5],
    ]
    private rsetup: Res[][] =
    [
        [new Merl(), new Percy(), new Res(), new Morg(), new Ass()],
        [new Merl(), new Percy(), new Res(), new Res(), new Morg(), new Ass()],
        [new Merl(), new Percy(), new Res(), new Res(), new Morg(), new Ass(), new Ober()],
        [new Merl(), new Percy(), new Res(), new Res(), new Res(), new Morg(), new Ass(), new Spy()],
        [new Merl(), new Percy(), new Res(), new Res(), new Res(), new Morg(), new Ass(), new Mord()],
        [new Merl(), new Percy(), new Res(), new Res(), new Res(), new Morg(), new Ass(), new Spy(), new Ober()],
    ]

    constructor(num: number, host: bigint) {
        super(num, host);
        this._name = "Avalon";
    }

    start(uid: bigint): number {
        this.gameSize = this._mem.size;
        if(this.gameSize < this.minSize || this.gameSize > this.maxSize) return 2;
        if(super.start(uid) == 1) return 1;

        return 0;
    }

    setup(thread: AnyThreadChannel): void {
        super.setup(thread);
        //shuffle and assign roles
        let curr = this.gameSize!, rand: number;
        let roles = this.rsetup[curr-5];
        while(curr > 0) {
            rand = Math.floor(Math.random() * curr);
            curr--;
            [roles[curr], roles[rand]] = [roles[rand], roles[curr]];
        }
        this.roleMap = new Map<bigint, Res>();
        for(let mem of this._mem.values()) {
            this.roleMap.set(mem, roles[curr++]);
        }

        const embed = new EmbedBuilder()
		.setTitle("Lobby started")
		.setDescription(this.desc());

		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('getrole')
				.setLabel('Get Role')
				.setStyle(ButtonStyle.Primary)
		);
        thread.send({ embeds: [embed], components: [row] });
    }

    getRole(uid: bigint): string | undefined {
        return this.roleMap?.get(uid)?.name;
    }
}