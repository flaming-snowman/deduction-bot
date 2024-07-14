// This is a lot of boilerplating I'm really sorry if you try to read this
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, StringSelectMenuBuilder, ThreadChannel } from 'discord.js';
import { Lobby } from './lobby'
import { Response } from './response'
import { Utils } from './utils'

enum Role {
    // Vanilla Roles
    Town = "Town",
    Evil = "Evil",

    // Power Good
    Invest = "Invest",
    Warden = "Warden",
    Hero = "Hero",

    // Power Evil
    Assassin = "Assassin",
    Mimic = "Mimic",
    Mastermind = "Mastermind",
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
    roles: Array<Role>;

    constructor (host: bigint) {
        this.host = host;
        this.powerRoles = new Set<Role>([Role.Mastermind]);
        this.roles = [];
    }

    verifyHost(uid: bigint): boolean {
        return uid == this.host;
    }

    displayString(): string {
        return `Evils: ${this.evils}\nBalls Each: ${this.ballsEach}\nEvil Balls: ${this.evilBalls}\nEvil Win Condition: ${this.evilWinCon}\nNumber of Rounds: ${this.numRounds}`;
    }

    initRoles(gameSize: number): Response {
        if(gameSize > this.maxSize || gameSize < this.minSize) {
            return { code: 1, message: `Error: Rotate supports only lobbies of size ${this.minSize} to ${this.maxSize}`};
        }
        this.roles = [];
        const targetEvil = this.evils;
        const targetGood = gameSize - this.evils;
        let evilCount = 0;
        let goodCount = 0;
        this.powerRoles.forEach(role => {
            this.roles.push(role);
            if(Config.isEvil(role)) evilCount++;
            else goodCount++;
        });
        console.log(evilCount, goodCount, targetEvil, targetGood)
        if(evilCount > targetEvil || goodCount > targetGood) {
            return { code: 1, message: "Error: Too many power roles for the number of players" };
        }

        // Push vanilla town roles for remaining good players
        const remainingGood = targetGood - goodCount;
        for (let i = 0; i < remainingGood; i++) {
            this.roles.push(Role.Town);
        }
        
        // Push vanilla evil roles for remaining evil players
        const remainingEvil = targetEvil - evilCount;
        for (let i = 0; i < remainingEvil; i++) {
            this.roles.push(Role.Evil);
        }

        this.gameSize = gameSize;

        return { code: 0, message: "Success" };
    }

    static isEvil(role: Role): boolean {
        return [Role.Evil, Role.Assassin, Role.Mimic, Role.Mastermind].includes(role);
    }
}

class Game {
    private roleMap: Map<bigint, Role> = new Map<bigint, Role>();
    private playOrder: bigint[] = [];
    private turn = -1;
    private notVoted: Set<bigint> = new Set<bigint>();
    private evilString: string = "";

    getRole(uid: bigint): string {
        const role = this.roleMap.get(uid);
        if(!role) return "Spectator";
        return role;
    }

    getRoleDesc(uid: bigint): string {
        const role = this.getRole(uid);
        switch(role) {
            case "Spectator": {
                return "You are a spectator. You are not part of the game.";
            }
            case Role.Town: {
                return "You are good. You have no special ability";
            }
            case Role.Hero: {
                return "You are the hero. For each evil player you select, good gains an additional point.";
            }
            case Role.Evil: {
                return `You are evil. You have no special ability.\n${this.evilString}`;
            }
            case Role.Mastermind: {
                return `You are the mastermind. At the end of the game, you choose the hero.\n${this.evilString}`;
            }
        }
        return "NOT IMPLEMENTED";
    }

    init(roles: Role[], members: Set<bigint>): void {
        Utils.shuf(roles);
        this.roleMap = new Map<bigint, Role>();
        this.playOrder = Array.from(members);
        for(let i = 0; i < roles.length; i++) {
            this.roleMap.set(this.playOrder[i], roles[i]);
        }
        Utils.shuf(this.playOrder);

        //store string of evil players
        this.evilString = "Evil players: ";
        for(let x of this.playOrder) {
            const player = this.roleMap.get(x)!;
            if(Config.isEvil(player)) this.evilString += `<@${x}>, `;
        }
        this.evilString = this.evilString.slice(0, -2);
    }

    playerString(): string {
        let playerString = "";
        for(let p of this.playOrder) {
            playerString += `<@${p}>: ${this.roleMap.get(p)!}\n`;
        }
        return playerString;
    }
}

export class Rotate extends Lobby
{
    rconfig: Config;
    game: Game = new Game();

    constructor(num: number, host: bigint) {
        super(num, host);
        super.addStatus('Town Win', Colors.Green); // 3
        super.addStatus('Evil Win', Colors.Red); // 4
        this.rconfig = new Config(host);
        this._name = "Rotate";
    }

    roleConfig(roles: string[]): void {
        this.rconfig.powerRoles.clear();
        roles.forEach(role => {this.rconfig.powerRoles.add(Role[role as keyof typeof Role])});
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

    start(uid: bigint): Response {
        const response = this.rconfig.initRoles(this._mem.size);
        if(response.code != 0) return response;
        return super.start(uid);
    }

    setup(thread: ThreadChannel): void {
        super.setup(thread);
        //shuffle and assign roles
        this.game.init(this.rconfig.roles, this._mem);

        const embed = new EmbedBuilder()
		.setTitle("Lobby started")
		.setDescription(this.desc())
        .setColor(Colors.DarkPurple);

		const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('rot_getrole')
				.setLabel('Get Role')
				.setStyle(ButtonStyle.Primary)
		);
        thread.send({ embeds: [embed], components: [row] }).catch(error => console.error('Permissions were revoked midgame'));
    }

    finishGame(reswin: boolean): void {
        const playerString = this.game.playerString();
        const embed = new EmbedBuilder()
		.setTitle(`${reswin ? 'Good' : 'Evil'} has won`)
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
}