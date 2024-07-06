// This is a lot of boilerplating I'm really sorry if you try to read this
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, StringSelectMenuBuilder, ThreadChannel } from 'discord.js';
import { Lobby } from './lobby'
import { Response } from './response'

enum Role {
    // Vanilla Roles
    Town = "Town",
    Evil = "Evil",

    // Power Good
    Invest = "Invest",
    Warden = "Warden",

    // Power Evil
    Assassin = "Assassin",
    Mimic = "Mimic",
}

class Config {
    private readonly minSize: number = 2;
    private readonly maxSize: number = 10;
    private readonly host: bigint;

    evils: number = 2;
    ballsEach: number = 2;
    evilBalls: number = 4;
    evilWinCon: number = 7;
    numRounds: number = 2;
    gameSize: number = 0;
    powerRoles: Set<Role>;

    constructor (host: bigint) {
        this.host = host;
        this.powerRoles = new Set<Role>([Role.Invest, Role.Warden, Role.Assassin, Role.Mimic]);
    }

    verifyHost(uid: bigint): boolean {
        return uid == this.host;
    }

    displayString(): string {
        return `Evils: ${this.evils}\nBalls Each: ${this.ballsEach}\nEvil Balls: ${this.evilBalls}\nEvil Win Condition: ${this.evilWinCon}\nNumber of Rounds: ${this.numRounds}`;
    }
}

export class Rotate extends Lobby
{
    private roleMap: Map<bigint, Role> = new Map<bigint, Role>();
    private playOrder: bigint[] = [];
    private turn = -1;
    private notVoted: Set<bigint> = new Set<bigint>();
    rconfig: Config;

    constructor(num: number, host: bigint) {
        super(num, host);
        super.addStatus('Town Win', Colors.Green); // 3
        super.addStatus('Evil Win', Colors.Red); // 4
        this.rconfig = new Config(host);
        this._name = "Rotate";
    }

    roleConfig(uid: bigint, roles: string[]): Response {
        if(!this.rconfig.verifyHost(uid)) return {code: 1, message: "Error: Only the host may change lobby settings"};
        this.rconfig.powerRoles.clear();
        roles.forEach(role => {this.rconfig.powerRoles.add(Role[role as keyof typeof Role])});
        return {code: 0, message: "Success"};
    }

    settingConfig(settings: number[]): Response {
        this.rconfig.evils = settings[0];
        this.rconfig.ballsEach = settings[1];
        this.rconfig.evilBalls = settings[2];
        this.rconfig.evilWinCon = settings[3];
        this.rconfig.numRounds = settings[4];
        return {code: 0, message: "Success"};
    }

    getEmbed(type: 'Standard' | 'Abandoned'): EmbedBuilder {
        switch(type) {
            case 'Abandoned':
                return super.getEmbed(type);
            case 'Standard':
                let s = "";
                this.rconfig.powerRoles.forEach(x => s += x + ', ');
                const embed = new EmbedBuilder()
                .setTitle(`Lobby ${this.id} - ${this.name}`)
                .addFields(
                    { name: 'Host', value: `<@${this.host()}>`, inline: true },
                    { name: 'Created', value: `<t:${this.time}:R>`, inline: true },
                    { name: 'Size', value: `${this.mem.size}`, inline: true },
                    { name: 'Members', value: this.list() },
                    { name: 'Roles', value: s == "" ? 'None' : s.slice(0,-2)},
                    { name: 'Settings', value: this.rconfig.displayString()},
                )
                .setFooter({ text: `Status: ${this.getStatus()}` })
                .setColor(this.getColor());
                return embed;
        }
    }
}