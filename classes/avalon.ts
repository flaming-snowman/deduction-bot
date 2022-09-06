// This is a lot of boilerplating I'm really sorry if you try to read this
import { ActionRowBuilder, AnyThreadChannel, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, SelectMenuBuilder } from 'discord.js';
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
    tris: boolean = false;
    isol: boolean = false;
    lover: boolean = false;
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

class Tristan extends Res
{
    constructor() {
        super();
        this.tris = true;
        this.lover = true;
        this.name = "Tristan";
    }
}

class Isolde extends Res
{
    constructor() {
        super();
        this.isol = true;
        this.lover = true;
        this.name = "Isolde";
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

class Ass extends Spy
{
    constructor() {
        super();
        this.ass = true;
        this.name = "Assassin";
    }
}

class Morg extends Spy
{
    constructor() {
        super();
        this.morg = true;
        this.name = "Morgana";
    }
}

class Mord extends Spy
{
    constructor() {
        super();
        this.mord = true;
        this.name = "Mordred";
    }
}

class Ober extends Spy
{
    constructor() {
        super();
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
    private minSize = 5;
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
        [2,3,2,3,3],
        [2,3,4,3,4],
        [2,3,3,4,4],
        [3,4,4,5,5],
        [3,4,4,5,5],
        [3,4,4,5,5],
    ]
    private spycount: number[] = [2,2,3,3,3,4];
    private rsetup: Res[] = [];
    private rconfig: string[] = ["Merlin", "Percival", "Morgana", "Assassin"];
    private _mcolor: number[] = [Colors.DarkGreen, Colors.DarkBlue, Colors.DarkRed, Colors.DarkGold, Colors.DarkOrange ]
    public get mcolor(): number {
        return this._mcolor[this.bigMission-1];
    }

    constructor(num: number, host: bigint) {
        super(num, host);
        super.addStatus('Res Win', Colors.Green); // 3
        super.addStatus('Spies Win', Colors.Red); // 4
        this._name = "Avalon";
    }

    config(uid: bigint, values: string[]): boolean {
        if(uid != this.host()) {
            return false;
        }
        this.rconfig = values;

        return true;
    }
    
    assign(): boolean {
        let res = 0;
        let spies = 0;
        const targetspy = this.spycount[this.gameSize! - this.minSize];
        const targetres = this.gameSize! - targetspy;
        this.rsetup = [];
        for(let role of this.rconfig) {
            switch(role) {
                case "Merlin": {
                    res++;
                    this.rsetup.push(new Merl());
                    break;
                }
                case "Percival": {
                    res++;
                    this.rsetup.push(new Percy());
                    break;
                }
                case "Tristan": {
                    res++;
                    this.rsetup.push(new Tristan());
                    break;
                }
                case "Isolde": {
                    res++;
                    this.rsetup.push(new Isolde());
                    break;
                }
                case "Morgana": {
                    spies++;
                    this.rsetup.push(new Morg());
                    break;
                }
                case "Mordred": {
                    spies++;
                    this.rsetup.push(new Mord());
                    break;
                }
                case "Assassin": {
                    spies++;
                    this.rsetup.push(new Ass());
                    break;
                }
                case "Oberon": {
                    spies++;
                    this.rsetup.push(new Ober());
                    break;
                }
            }
        }
        if(res > targetres || spies > targetspy) return false;
        for(let i = 0; i < targetres-res; i++) {
            this.rsetup.push(new Res());
        }
        for(let i = 0; i < targetspy-spies; i++) {
            this.rsetup.push(new Spy());
        }
        return true;
    }

    start(uid: bigint): number {
        this.gameSize = this._mem.size;
        if(this.gameSize < this.minSize || this.gameSize > this.maxSize) return 2;
        if(!this.assign()) return 3;
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
        let roles = this.rsetup;
        this.shuf(roles);
        this.roleMap = new Map<bigint, Res>();
        this.playOrder = Array.from(this._mem);
        for(let i = 0; i < roles.length; i++) {
            this.roleMap.set(this.playOrder[i], roles[i]);
        }
        this.shuf(this.playOrder);

        const embed = new EmbedBuilder()
		.setTitle("Lobby started")
		.setDescription(this.desc())
        .setColor(Colors.DarkPurple);

		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('getrole')
				.setLabel('Get Role')
				.setStyle(ButtonStyle.Primary)
		);
        thread.send({ embeds: [embed], components: [row] }).catch(error => console.error('Permissions were revoked midgame'));

        this.nextMission();
    }

    nextMission() {
        let gameSize = this.gameSize!;
        let missionSize = this.msetup[gameSize-this.minSize][this.bigMission-1];
        
        this.subMission++;
        this.turn++;

        if(this.subMission == 6) {
            //hammer rejected
            this.finishGame(false);
            return;
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
        .setDescription(playerString)
        .setColor(this.mcolor);

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
        this._thread?.send({ embeds: [embed], components: [row] }).catch(error => console.error('Permissions were revoked midgame'));
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

    isHammer(): boolean {
        return this.subMission == 5;
    }

    embarkMission(): void {
        const embed = new EmbedBuilder()
        .setTitle(`Mission ${this.bigMission}`)
        .setDescription(this.curMission!.list())
        .addFields(
            { name: 'Waiting on votes from:', value: this.curMission!.getNotVoted() },
        )
        .setColor(this.mcolor);

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

        this._thread?.send({ embeds: [embed], components: [row] }).catch(error => console.error('Permissions were revoked midgame'));
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
            this.finishGame(false);
            return;
        }
        if(this.bigMission-this.failNum == 3) {
            for(const uid of this._mem) {
                if(this.roleMap!.get(uid)!.ass) {
                    this.startAss(uid);
                    return;
                }
            }
            this.finishGame(true);
            return;
        }
        this.bigMission++;
        this.subMission = 0;
        this.hammer = this.turn+5;
        this.nextMission();
    }

    startAss(ass: bigint): void {
        let minass: number = 1, maxass: number = 1;
        let merl = false, tristan = false, isolde = false;
        for(const uid of this._mem) {
            if(this.roleMap!.get(uid)!.merl) merl = true;
            if(this.roleMap!.get(uid)!.tris) tristan = true;
            if(this.roleMap!.get(uid)!.isol) isolde = true;
        }
        if(merl && tristan && isolde) {
            maxass = 2;
        }
        else if(tristan && isolde) {
            minass = 2;
            maxass = 2;
        }
        else if(!merl) {
            // no one to shoot so res auto-win
            this.finishGame(true);
            return;
        }

        const embed = new EmbedBuilder()
        .setTitle(`Assassination`)
        .setDescription(`Waiting for <@${ass}> to shoot`)
        .setColor(Colors.DarkVividPink);

        const row = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('shoot')
                .setPlaceholder(`Pick who to assassinate`)
                .setMinValues(minass)
                .setMaxValues(maxass)
                .addOptions(
                    Array.from(this.playOrder!.filter(x => !this.roleMap!.get(x)!.spy || this.roleMap!.get(x)!.ober), x => ({label: this._nameMap!.get(x)!, value: String(x)}))
                )
        )

        this._thread?.send({ embeds: [embed], components: [row] }).catch(error => console.error('Permissions were revoked midgame')); 
    }

    endAss(uid: bigint, vals: string[]): null | boolean {
        if(!this.roleMap!.get(uid)!.ass) return null;
        if(vals.length == 1) {
            // merl shot
            return this.roleMap!.get(BigInt(vals[0]))!.merl;
        }
        else {
            // lovers shot
            return this.roleMap!.get(BigInt(vals[0]))!.lover && this.roleMap!.get(BigInt(vals[1]))!.lover;
        }
    }

    finishGame(reswin: boolean): void {
        let playerString = "";
        for(let p of this.playOrder!) {
            playerString += `<@${p}>: ${this.roleMap!.get(p)!.name}\n`;
        }

        const embed = new EmbedBuilder()
		.setTitle(`The ${reswin ? 'Resistance' : 'Spies'} have won`)
		.setDescription(playerString.slice(0,-1))
		.setColor(reswin ? Colors.Green : Colors.Red);

        this._thread?.send({ embeds: [embed] }).catch(error => console.error('Permissions were revoked midgame'));

        super.setStatus(reswin ? 3 : 4);

        const uembed = super.getEmbed('Standard').setFields(
            { name: 'Host', value: `<@${this.host()}>`, inline: true },
                { name: 'Created', value: `<t:${this.time}:R>`, inline: true },
                { name: 'Size', value: `${this._mem.size}`, inline: true },
                { name: 'Members', value: playerString.slice(0,-1) },
                { name: 'Status', value: this.getStatus()},
        )
        super.updateEmbed(uembed);
    }

    getRole(uid: bigint): string {
        return this.roleMap!.get(uid)!.name;
    }

    getRoleDesc(uid: bigint): string {
        const role = this.getRole(uid);
        switch(role) {
            case 'Resistance':
            case 'Oberon': {
                return "No special information is known to you";
            }
            case 'Merlin': {
                let s = "Spies known: ";
                for(let x of this.playOrder!) {
                    const player = this.roleMap!.get(x)!;
                    if(player.spy && !player.mord) {
                        s += `<@${x}>, `;
                    }
                }
                return s.slice(0, -2);
            }
            case 'Percival': {
                let s = "Potential Merlins: ";
                for(let x of this.playOrder!) {
                    const player = this.roleMap!.get(x)!;
                    if(player.merl || player.morg) {
                        s += `<@${x}>, `;
                    }
                }
                return s.slice(0, -2);
            }
            case 'Tristan':
            case 'Isolde': {
                let s = "Lovers: ";
                for(let x of this.playOrder!) {
                    const player = this.roleMap!.get(x)!;
                    if(player.lover) {
                        s += `<@${x}>, `;
                    }
                }
                return s.slice(0, -2);
            }
            case 'Spy':
            case 'Assassin':
            case 'Morgana':
            case 'Mordred': {
                let s = "Spies known: ";
                for(let x of this.playOrder!) {
                    const player = this.roleMap!.get(x)!;
                    if(player.spy && !player.ober) {
                        s += `<@${x}>, `;
                    }
                }
                return s.slice(0, -2);
            }
        }
        return "Bug: please notify the developer";
    }

    getEmbed(type: 'Standard' | 'Abandoned'): EmbedBuilder {
        if(type == 'Abandoned') {
            return super.getEmbed(type);
        }
        if(type == 'Standard') {
            let s = "";
            this.rconfig.forEach(x => s += x + ', ');
            const embed = new EmbedBuilder()
            .setTitle(`Lobby ${this.id} - ${this.name}`)
            .addFields(
                { name: 'Host', value: `<@${this.host()}>`, inline: true },
                { name: 'Created', value: `<t:${this.time}:R>`, inline: true },
                { name: 'Size', value: `${this.mem.size}`, inline: true },
                { name: 'Members', value: this.list() },
                { name: 'Roles', value: s == "" ? 'None' : s.slice(0,-2)},
                { name: 'Status', value: this.getStatus()},
            )
            .setColor(this.getColor());
            return embed;
        }
        // TypeScript is stupid and thinks this code is necessary and reachable
        return new EmbedBuilder();
    }
}