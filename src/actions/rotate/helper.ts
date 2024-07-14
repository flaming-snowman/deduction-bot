import { GLOBBY } from '../../classes/globby';
import { Rotate } from '../../classes/rotate';
export class Helper {
    static getLobbyFromMsg(gid: bigint, mid: bigint): Rotate | null{
        const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromMsg(mid);
		if(!lobbyID) {
            return null;
		}
        return globby.get(lobbyID!)! as Rotate;
    }
    static getLobbyFromThread(gid: bigint, tid: bigint): Rotate | null{
		const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromThread(tid);
		if(!lobbyID) {
            return null;
		}
        return globby.get(lobbyID!)! as Rotate;
    }
}