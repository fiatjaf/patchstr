import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { RelayPool } from "nostr-relaypool";

import './App.css';
import { PatchCache } from './Cache/PatchCache';
import { PatchstrDb } from './Db';
import { PatchRow } from './PatchRow';
import { parseDiffEvent } from './Diff';

const relays = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.snort.social"
];

export const PatchKind = 19691228;

const Store = new PatchCache("Patches", PatchstrDb.events);
export const Nostr = new RelayPool(relays);

function usePatchStore() {
  return useSyncExternalStore(a => Store.hook(a, "*"), () => Store.snapshot());
}

export function App() {
  const store = usePatchStore();
  const navigate = useNavigate();
  const [tag, setTag] = useState<string>();

  useEffect(() => {
    const sub = Nostr.subscribe([
      {
        kinds: [PatchKind],
        limit: 200
      }
    ], relays,
      async (e) => {
        const p = parseDiffEvent(e);
        if (p.tag) {
          await Store.set(p);
        }
      }
    );
    return sub;
  }, []);

  const patches = useMemo(() => {
    return [...store.filter(a => tag === undefined || a.tag === tag)].sort(a => -a.created);
  }, [tag, store]);

  return (
    <div className="app nostr">
      <section className="side">
        <div onClick={() => setTag(undefined)}>
          All
        </div>
        {[...new Set(store.map(a => a.tag))].map(a => <div key={a} onClick={() => setTag(a)}>
          {a}
        </div>)}
        <div onClick={() => navigate("/new")}>
          + Create Patch
        </div>
      </section>
      <section className="patch-list">
        {patches.map(a => <PatchRow ev={a} key={a.id} />)}
      </section>
    </div>
  );
}