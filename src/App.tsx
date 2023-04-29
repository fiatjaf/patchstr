import { useMemo, useState, useSyncExternalStore } from 'react';
import './App.css';
import { RelayPool } from "nostr-relaypool";
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
const Nostr = new RelayPool(relays);
const sub = Nostr.subscribe([
  {
    kinds: [PatchKind],
    limit: 200
  }
], relays,
  async (e) => {
    console.debug(e);
    await Store.set(parseDiffEvent(e));
  }
);

function usePatchStore() {
  return useSyncExternalStore(a => Store.hook(a, "*"), () => Store.snapshot());
}

export function App() {
  const store = usePatchStore();
  const tags = [...new Set(store.map(a => a.tag))];
  const [tag, setTag] = useState<string>();

  const patches = useMemo(() => {
    return store.filter(a => tag === undefined || a.tag === tag);
  }, [tag]);
  return (
    <div className="app nostr">
      <section className="side">
        <div onClick={() => setTag(undefined)}>
          All
        </div>
        {tags.map(a => <div key={a} onClick={() => setTag(a)}>
          {a}
        </div>)}
      </section>
      <section className="patch-list">
        {patches.map(a => <PatchRow ev={a} key={a.id} />)}
      </section>
    </div>
  );
}