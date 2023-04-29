import "./PatchRow.css"
import moment from "moment";
import { ParsedPatch } from "./Diff";
import { useNavigate } from "react-router-dom";
import { PatchKind } from "./App";
import { encodeTLV } from "./TLV";
import { NostrPrefix } from "./Nostr";

export function PatchRow({ ev }: { ev: ParsedPatch }) {
    const navigate = useNavigate();

    function goToPatch() {
        const link = encodeTLV(ev.id, NostrPrefix.Event, undefined, PatchKind);
        navigate(`/e/${link}`, {
            state: ev
        });
    }

    const ts = new Date(ev.created * 1000);
    return <div className="patch-row" onClick={goToPatch}>
        <div className="patch-header">
            <div>
                {ev.author.name}
            </div>
            <div>
                {ev.subject}
            </div>
            <div>
                <time dateTime={ts.toISOString()}>
                    {moment(ts).fromNow()}
                </time>
            </div>
            <div>
                <span className="add">
                    +{ev.diff.reduce((acc, v) => acc + v.additions, 0)}
                </span>
                &nbsp;
                <span className="del">
                    -{ev.diff.reduce((acc, v) => acc + v.deletions, 0)}
                </span>
            </div>
        </div>
    </div>
}