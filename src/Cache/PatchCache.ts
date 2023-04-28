import BaseFeedCache from "./BaseFeedCache";
import { ParsedPatch } from "../Diff";

export class PatchCache extends BaseFeedCache<ParsedPatch> {
    key(of: ParsedPatch): string {
        return of.id;
    }

    takeSnapshot(): ParsedPatch[] {
        return [...this.cache.values()];
    }

}