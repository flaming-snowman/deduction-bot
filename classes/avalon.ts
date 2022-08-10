// This is a lot of boilerplating I'm really sorry if you try to read this

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
        const resultstr = this.fails < this.failsreq ? "succeeded" : "failed"
        return `Mission ${resultstr} with ${this.fails} fails`;
    }
}

class Avalon
{
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
}