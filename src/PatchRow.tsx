import moment from "moment";
import { useNavigate } from "react-router-dom";
import { neventEncode } from "nostr-tools/nip19";

import "./PatchRow.css"
import { ParsedPatch } from "./Diff";
import { PatchKind } from "./App";
import useProfile from "./useProfile";

export function PatchRow({ ev }: { ev: ParsedPatch }) {
    const navigate = useNavigate();
    const profile = useProfile(ev.pubkey);

    function goToPatch() {
        const link = neventEncode({ id: ev.id, kind: PatchKind });
        navigate(`/e/${link}`, {
            state: ev
        });
    }

    const ts = new Date(ev.created * 1000);
    return <div className="patch-row" onClick={goToPatch}>
        <div className="patch-header">
            <div>
                {profile?.picture && <img src={profile.picture} />}
                {profile?.display_name ?? profile?.name ?? ev.pubkey}
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
