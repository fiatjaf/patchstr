import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { neventEncode } from "nostr-tools/nip19";

import "./NewPatch.css";
import PatchView from "./PathView";
import { parseDiffEvent } from "./Diff";
import { unixNow } from "./Util";
import buildPatchEvent from "./PatchBuilder";
import { Nostr } from "./App";
import { ParsedRepo } from "./Repo";

export default function NewPatch() {
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [diff, setDiff] = useState("");
    const {naddr} = useParams()
    let parsedRepo: ParsedRepo

    async function submitPatch() {
        const ev = await buildPatchEvent(parsedRepo, subject, diff);
        console.debug(ev);
        Nostr.publish(ev, parsedRepo.patches);
        navigate(`/e/${neventEncode({id: ev.id})}`, {
            state: ev
        });
    }

    function inputs() {
        return <div>
            <a href="/">&lt; Back</a>
            <h1>
                New Patch to {naddr}
            </h1>
            <p>
                Patch Title:
            </p>
            <input type="text" placeholder="chore: tweak NIP's" value={subject} onChange={e => setSubject(e.target.value)} />
            <p>
                Git Repo:
            </p>
            <textarea cols={80} rows={40} value={diff} onChange={e => setDiff(e.target.value)}></textarea>
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

    const location = useLocation();
    if (!location.state) {
        return <b>Missing route data</b>
    }
    parsedRepo = location.state as ParsedRepo

    return <div className="new-patch">
        {inputs()}
        {preview()}
    </div>
}
