import BaseFeedCache from "./BaseFeedCache";
import { ParsedRepo } from "../Repo";

export class RepoCache extends BaseFeedCache<ParsedRepo> {
    key(of: ParsedRepo): string {
        return of.pubkey + '/' + of.id;
    }

    takeSnapshot(): ParsedRepo[] {
        return [...this.cache.values()];
    }

}
