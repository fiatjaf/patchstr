import { Chunk, File } from "parse-diff";
import { useLocation } from "react-router-dom"

import "./PatchReview.css";
import { ParsedPatch } from "./Diff";

export default function PatchReview() {
    const location = useLocation();

    if (!location.state) {
        return <b>Missing route data</b>
    }

    function renderChunk(c: Chunk) {
        return <>
            <div className="diff no-change">
                <div></div>
                <div></div>
                <div>
                    {c.content}
                </div>
            </div>
            {c.changes.map(v => <div className={`diff ${v.type}`}>
                <div></div>
                <div></div>
                <div>
                    {v.content}
                </div>
            </div>)}
        </>
    }

    function renderFileChanges(f: File) {
        const k = `${f.from}=${f.to}`;
        return <div className="file" key={k}>
            <div className="header">
                <div>
                    {f.from}{f.to && `...${f.to}`}
                </div>
                <div>
                    <div className="add">
                        +{f.additions ?? 0}
                    </div>
                    <div className="del">
                        -{f.deleted ?? 0}
                    </div>
                </div>
            </div>
            <div className="body">
                {f.chunks.map(renderChunk)}
            </div>
        </div>
    }

    const patch = location.state as ParsedPatch
    return <>
        {patch.diff.map(renderFileChanges)}
    </>
}