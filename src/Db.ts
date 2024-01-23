import Dexie, { Table } from "dexie";
import { ParsedPatch } from "./Diff";
import { ParsedRepo } from "./Repo";

export class Db extends Dexie {
    events!: Table<ParsedPatch>;
    repos!: Table<ParsedRepo>

    constructor() {
        super("patchstr");
        this.version(1).stores({
            events: "++id"
        });
    }
}

export const PatchstrDb = new Db();
