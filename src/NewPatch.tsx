import { useMemo, useState } from "react";

import "./NewPatch.css";
import PatchView from "./PathView";
import { parseDiffEvent } from "./Diff";
import { unixNow } from "./Util";
import buildPatchEvent from "./PatchBuilder";
import { Nostr } from "./App";
import { useNavigate } from "react-router-dom";
import { encodeTLV } from "./TLV";
import { NostrPrefix } from "./Nostr";

export default function NewPatch() {
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [diff, setDiff] = useState("");
    const [repo, setRepo] = useState("");
    const [relay, setRelay] = useState("");

    async function submitPatch() {
        const ev = await buildPatchEvent(subject, "", repo, diff);
        console.debug(ev);

        Nostr.publish(ev, relay.split(/[,; ]/));
        navigate(`/e/${encodeTLV(ev.id, NostrPrefix.Event)}`, {
            state: ev
        });
    }

    function inputs() {
        return <div>
            <a href="/">&lt; Back</a>
            <h1>
                New Patch
            </h1>
            <p>
                Patch Title:
            </p>
            <input type="text" placeholder="chore: tweak NIP's" value={subject} onChange={e => setSubject(e.target.value)} />
            <p>
                Enter Diff:
            </p>
            <textarea cols={80} rows={40} value={diff} onChange={e => setDiff(e.target.value)}></textarea>
            <p>
                Git Repo:
            </p>
            <input type="text" placeholder="https://github.com/user/repo" value={repo} onChange={e => setRepo(e.target.value)} />
            <p>
                Relay(s):
            </p>
            <input type="text" placeholder="wss://nostr.mutinywallet.com wss://nos.lol" value={relay} onChange={e => setRelay(e.target.value)} />
            <br /><br />
            <button onClick={() => submitPatch()}>
                Submit
            </button>
        </div>;
    }

    const tmpDiff = useMemo(() => {
        return parseDiffEvent({
            created_at: unixNow(),
            content: diff,
            pubkey: "",
            sig: "",
            id: "",
            tags: [],
            kind: 0
        })
    }, [diff]);

    function preview() {
        return <div>
            <PatchView patch={tmpDiff} />
        </div>
    }

    return <div className="new-patch">
        {inputs()}
        {preview()}
    </div>
}