import type { EventTemplate, Event } from 'nostr-tools/pure'
import { unixNow } from "./Util";
import { PatchKind, RepoAnnouncementKind } from "./App";
import { ParsedRepo } from './Repo';

declare global {
  interface Window {
    nostr: {
      getPublicKey: () => Promise<string>;
      signEvent: (event: EventTemplate) => Promise<Event>;
      getRelays: () => Promise<Record<string, { read: boolean; write: boolean }>>;
      nip04: {
        encrypt: (pubkey: string, content: string) => Promise<string>;
        decrypt: (pubkey: string, content: string) => Promise<string>;
      };
    };
  }
}

export default async function buildPatchEvent(repoAnnouncement: ParsedRepo, diff: string) {
  return await window.nostr.signEvent({
    kind: PatchKind,
    content: diff,
    created_at: unixNow(),
    tags: [
      ["a", `${RepoAnnouncementKind}:${repoAnnouncement.pubkey}:${repoAnnouncement.id}`],
    ]
  })
}
