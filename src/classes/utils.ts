export class Utils {
    static rand(min: number, max: number): number {
        // Return a random integer in [min, max)
        return Math.floor(Math.random() * (max - min)) + min;
    }
    static shuf(arr: any[]): void {
        let curr = arr.length, rand: number;
        while(curr > 1) {
            rand = this.rand(0, curr);
            curr--;
            [arr[curr], arr[rand]] = [arr[rand], arr[curr]];
        }
    }
}