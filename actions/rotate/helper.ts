import { GLOBBY } from '../../classes/globby';
import { Rotate } from '../../classes/rotate';
export class Helper {
    static getLobby(gid: bigint, mid: bigint): Rotate | null{
        const globby = GLOBBY.get(gid);
		const lobbyID = globby.getFromMsg(mid);
		if(!lobbyID) {
            return null;
		}
        return globby.get(lobbyID!)! as Rotate;
    }
}