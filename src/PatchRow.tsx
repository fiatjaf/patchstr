import "./PatchRow.css"
import moment from "moment";
import { ParsedPatch } from "./Diff";

export function PatchRow({ ev }: { ev: ParsedPatch }) {
    const ts = new Date(ev.created * 1000);
    return <div className="patch-row">
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
                <span className="remove">
                    -{ev.diff.reduce((acc, v) => acc + v.deletions, 0)}
                </span>
            </div>
        </div>
    </div>
}