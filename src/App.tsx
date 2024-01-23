import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from 'nostr-tools/pure';
import { RelayPool } from "nostr-relaypool";

import './App.css';
import { PatchCache } from './Cache/PatchCache';
import { PatchstrDb } from './Db';
import { PatchRow } from './PatchRow';
import { parseDiffEvent, RepoReference } from './Diff';
import { RepoCache } from './Cache/RepoCache';
import { parseRepoEvent } from './Repo';
import { naddrEncode } from 'nostr-tools/nip19';

const relays = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.snort.social",
  "wss://relay.primal.net",
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.fmt.wiz.biz",
  "wss://relay.nostr.bg",
];

export const PatchKind = 1617;
export const RepoAnnouncementKind = 30617;

const PatchStore = new PatchCache("Patches", PatchstrDb.events);
const RepoStore = new RepoCache("Repos", PatchstrDb.repos);
export const Nostr = new RelayPool(relays);

function usePatchStore() {
  return useSyncExternalStore(a => PatchStore.hook(a, "*"), () => PatchStore.snapshot());
}

function useRepoStore() {
  return useSyncExternalStore(a => RepoStore.hook(a, "*"), () => RepoStore.snapshot());
}

export function App() {
  const patchStore = usePatchStore();
  const repoStore = useRepoStore();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<RepoReference>();

  useEffect(() => {
    const sub = Nostr.subscribe([
      {
        kinds: [PatchKind,RepoAnnouncementKind],
        limit: 200
      }
    ], relays,
      async (e: Event, _: boolean, relay: string) => {
        switch (e.kind as number) {
          case PatchKind: {
            const p = parseDiffEvent(e);
            await PatchStore.set(p);
            break
          }
          case RepoAnnouncementKind: {
            const p = parseRepoEvent(e);
            p.relay = relay
            await RepoStore.set(p);
            break
          }
        }
      }
    );
    return sub;
  }, []);

  const patches = useMemo(() => {
    return [...patchStore].filter(patch => !repo || (patch.repo?.id === repo.id && patch.repo?.pubkey === repo.pubkey)).sort(a => -a.created);
  }, [repo, patchStore]);

  console.log("REPOSTORE", repoStore)

  return (
    <div className="app nostr">
      <section className="side">
        <div onClick={() => setRepo(undefined)}>
          All
        </div>
        {repoStore.map(repo => (
          <div
            key={repo.pubkey + "/" + repo.id}
            onClick={() => setRepo({id: repo.id, pubkey: repo.pubkey, relay: undefined})}>
              {repo.name || repo.id}
          </div>
        ))}
        {repo && <div onClick={() => navigate("/new/" + naddrEncode({ identifier: repo.id, kind: RepoAnnouncementKind, relays: repo.relay ? [repo.relay] : [], pubkey: repo.pubkey }))}>
          + Create Patch
        </div>}
      </section>
      <section className="patch-list">
        {patches.map(a => <PatchRow ev={a} key={a.id} />)}
      </section>
    </div>
  );
}
