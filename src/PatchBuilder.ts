import { Event, Kind } from "nostr-tools";
import { unixNow } from "./Util";
import { PatchKind } from "./App";

declare global {
  interface Window {
    nostr: {
      getPublicKey: () => Promise<string>;
      signEvent: (event: Event) => Promise<Event>;
      getRelays: () => Promise<Record<string, { read: boolean; write: boolean }>>;
      nip04: {
        encrypt: (pubkey: string, content: string) => Promise<string>;
        decrypt: (pubkey: string, content: string) => Promise<string>;
      };
    };
  }
}

export default async function buildPatchEvent(title: string, author: string, repo: string, diff: string) {
  const pk = await window.nostr.getPublicKey();

  return await window.nostr.signEvent({
    id: "",
    sig: "",
    kind: PatchKind as Kind,
    pubkey: pk,
    content: diff,
    created_at: unixNow(),
    tags: [
      ["t", repo.split("/").pop()!.replace(".git", "")],
      ["subject", title],
      ["author", author]
    ]
  })
}