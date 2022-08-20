// This is a lot of boilerplating I'm really sorry if you try to read this
import { SelectMenuBuilder } from '@discordjs/builders';
import { ActionRowBuilder, AnyThreadChannel, ButtonBuilder, ButtonStyle, EmbedBuilder, ThreadAutoArchiveDuration, ThreadMember } from 'discord.js';
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
    missionMem: Set<bigint>;
    notVoted: Set<bigint>;
    private fails: number = 0;
    private failsreq: number;
    constructor(mem: Set<bigint>, gamesize: number, mission: number) {
        this.missionMem = new Set<bigint>(mem);
        this.notVoted = new Set<bigint>(mem);

        if(gamesize < 7 || mission != 4) {
            this.failsreq = 1;
        } else {
            this.failsreq = 2;
        }
    }
    vote(uid: bigint, failed: boolean): number {
        /*
            0: vote recorded
            1: player not on mission
            2: player already voted
            3: all votes in
        */
        if(!this.missionMem.has(uid)) return 1;
        if(!this.notVoted.has(uid)) return 2;
        if(failed) this.fails++;
        this.notVoted.delete(uid);
        if(this.notVoted.size == 0) return 3;
        return 0;
    }
    list(): string {
        let s = "";
        for(const p of this.missionMem) {
            s += `<@${p}>\n`;
        }
        return s.slice(0, -1);
    }
    getNotVoted(): string {
        let s = "";
        for(const p of this.notVoted!) {
            s += `<@${p}>\n`;
        }
        return s.slice(0, -1); 
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
    private minSize = 1;
    private maxSize = 10;
    private gameSize?: number;
    private roleMap?: Map<bigint, Res>;
    private playOrder?: bigint[];
    private turn = -1;
    private bigMission = 1;
    private subMission = 0;
    private hammer = 4;
    private failNum = 0;
    private apps?: Set<bigint>;
    private curMission?: Mission;
    private notVoted?: Set<bigint>;
    private msetup: number[][] =
    [
        [1,1,1,1,1],
        [1,1,1,1,1],
        [2,3,2,3,3],
        [2,3,4,3,4],
        [2,3,3,4,4],
        [3,4,4,5,5],
        [3,4,4,5,5],
        [3,4,4,5,5],
    ]
    private rsetup: Res[][] =
    [
        [new Res()],
        [new Merl(), new Ass()],
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

    shuf(arr: any[]): void {
        let curr = arr.length, rand: number;
        while(curr > 1) {
            rand = Math.floor(Math.random() * curr);
            curr--;
            [arr[curr], arr[rand]] = [arr[rand], arr[curr]];
        }
    }

    setup(thread: AnyThreadChannel): void {
        super.setup(thread);
        //shuffle and assign roles
        let roles = this.rsetup[this.gameSize!-this.minSize];
        this.shuf(roles);
        roles.forEach(x => console.log(x.name));
        this.roleMap = new Map<bigint, Res>();
        this.playOrder = Array.from(this._mem);
        for(let i = 0; i < roles.length; i++) {
            this.roleMap.set(this.playOrder[i], roles[i]);
        }
        this.shuf(this.playOrder);

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

        this.nextMission();
    }

    nextMission() {
        let gameSize = this.gameSize!;
        let missionSize = this.msetup[gameSize-this.minSize][this.bigMission-1];
        
        this.subMission++;
        this.turn++;

        if(this.subMission == 6) {
            // spies win
        }

        let playerString = "";
        for(let i = 0; i < gameSize; i++) {
            if(i == this.turn%gameSize) {
                playerString += ':crown: ';
            } 
            if(i == this.hammer%gameSize) {
                playerString += ':hammer: ';
            }
            playerString += `<@${this.playOrder![i]}>`;
            if(i < gameSize-1) playerString += '\n';
        }
        const embed = new EmbedBuilder()
        .setTitle(`Mission ${this.bigMission}.${this.subMission}`)
        .setDescription(playerString);

        const row = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('pickmission')
                .setPlaceholder(`Select ${missionSize} players`)
                .setMinValues(missionSize)
                .setMaxValues(missionSize)
                .addOptions(
                    Array.from(this.playOrder!, (x, i) => ({label: this._nameMap!.get(x)!, value: String(i)}))
                )
        )
        this._thread?.send({ embeds: [embed], components: [row] });
    }

    pickMission(uid: bigint, selected: string[]): string | null {
        if(this.playOrder![this.turn%this.gameSize!] != uid) return null;
        let players: Set<bigint> = new Set<bigint>();
        for(const p of selected) {
            players.add(this.playOrder![Number(p)]!);
        }

        this.curMission = new Mission(players, this.gameSize!, this.bigMission);
        this.apps = new Set<bigint>();
        this.notVoted = new Set<bigint>(this._mem);
        
        return this.curMission.list();
    }

    voteMission(uid: bigint, approved: boolean): number {
        /*
            0: vote recorded
            1: player not in game
            2: player already voted
            3: all votes in
        */
        if(!this._mem.has(uid)) return 1;
        if(!this.notVoted!.has(uid)) return 2;
        if(approved) this.apps!.add(uid);
        this.notVoted!.delete(uid);
        if(this.notVoted!.size == 0) return 3;
        return 0;
    }

    getNotVoted(): string {
        let s = "";
        for(const p of this.notVoted!) {
            s += `<@${p}>\n`;
        }
        return s.slice(0, -1); 
    }
    
    voteString(): string {
        let s = "";
        for(const p of this.playOrder!) {
            s += this.apps!.has(p) ? ":white_check_mark: " : ":x: ";
            s += `<@${p}>\n`;
        }
        return s.slice(0, -1); 
    }

    votePass(): boolean {
        return this.apps!.size*2 > this.gameSize!;
    }

    embarkMission(): void {
        const embed = new EmbedBuilder()
        .setTitle(`Mission ${this.bigMission}`)
        .setDescription(this.curMission!.list())
        .addFields(
            { name: 'Waiting on votes from:', value: this.curMission!.getNotVoted() },
        );

        const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
			.setCustomId('succeed')
			.setLabel('Succeed')
			.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
			.setCustomId('fail')
			.setLabel('Fail')
			.setStyle(ButtonStyle.Danger)
		);

        this._thread?.send({ embeds: [embed], components: [row] });
    }

    voteEmbark(uid: bigint, failed: boolean): number {
        return this.curMission!.vote(uid, failed);
    }

    getEmbarkNotVoted(): string {
        return this.curMission!.getNotVoted();
    }

    embarkSuccess(): boolean {
        return this.curMission!.success();
    }

    embarkResult(): string {
        return this.curMission!.result();
    }

    embarkFinish(): void {
        if(!this.embarkSuccess()) this.failNum++;
        if(this.failNum == 3) {
            //spies win
        }
        if(this.bigMission-this.failNum == 3) {
            //ass time
        }
        this.bigMission++;
        this.subMission = 0;
        this.nextMission();
    }

    getRole(uid: bigint): string | undefined {
        return this.roleMap?.get(uid)?.name;
    }
}