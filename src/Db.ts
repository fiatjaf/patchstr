import Dexie, { Table } from "dexie";
import { ParsedPatch } from "./Diff";

export class Db extends Dexie {
    events!: Table<ParsedPatch>;
    
    constructor() {
        super("patchstr");
        this.version(1).stores({
            events: "++id"
        });
    }
}

export const PatchstrDb = new Db();