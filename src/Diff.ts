import * as parseDiff from "parse-diff";
import { Event } from 'nostr-tools';

export interface ParsedPatch {
    id: string
    created: number
    pubkey: string
    tag: string
    author: AuthorName
    subject: string
    diff: parseDiff.File[],
    patchFile: string
}

export interface AuthorName {
    name: string
    email: string
}

export function parseDiffEvent(ev: Event) {
    const tag = ev.tags.find(a => a[0] === "t")?.[1] ?? "";
    const author = ev.tags.find(a => a[0] === "author")?.[1] ?? "";
    const subject = ev.tags.find(a => a[0] === "subject")?.[1] ?? "";

    const EmailRegex = /^([\w ]+)(?: <(\S+)>)?$/i;
    const matches = author.match(EmailRegex);
    return {
        id: ev.id,
        created: ev.created_at,
        pubkey: ev.pubkey,
        tag,
        author: {
            name: matches?.[1] ?? ev.pubkey.slice(0, 12),
            email: matches?.[2]
        },
        subject,
        diff: parseDiff.default(ev.content),
        patchFile: ev.content
    } as ParsedPatch;
}