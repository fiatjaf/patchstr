import * as parseDiff from "parse-diff";
import { Event } from 'nostr-tools/pure';
import { RepoAnnouncementKind } from "./App";

export interface ParsedPatch {
    id: string
    created: number
    pubkey: string
    subject: string
    diff: parseDiff.File[],
    patchFile: string
    repo: RepoReference | undefined
}

export type RepoReference = {
    id: string
    pubkey: string
    relay: string | undefined
}

export function parseDiffEvent(ev: Event): ParsedPatch {
    const subject = ev.content.split('\n').slice(0, 6)
        .map(line => line.match(/^Subject: (.*)$/)).filter(m => m)[0]?.[1] || ev.id;

    let repo: RepoReference | undefined = undefined
    let a = ev.tags.find(a => a[0] === "a")
    if (a && a[1]) {
        let [kind, pubkey, id] = a[1].split('/')
        if (parseInt(kind) === RepoAnnouncementKind) {
          repo = {
            pubkey,
            id,
            relay: a[2]
          }
        }
    }

    return {
        id: ev.id,
        created: ev.created_at,
        pubkey: ev.pubkey,
        subject,
        diff: parseDiff.default(ev.content),
        patchFile: ev.content,
        repo: repo,
    };
}
