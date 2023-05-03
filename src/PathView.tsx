import { File, Chunk } from "parse-diff";
import hljs from "highlight.js";
import 'highlight.js/styles/dark.css';

import "./PatchView.css";
import { ParsedPatch } from "./Diff";
import Icon from "./Icon";

export default function PatchView({ patch }: { patch: ParsedPatch }) {

    function renderChunk(c: Chunk) {
        var oldY = c.oldStart;
        var newY = c.newStart;
        return <>
            <div className="diff chunk">
                <div></div>
                <div></div>
                <div></div>
                <div>
                    {c.content}
                </div>
            </div>
            {c.changes.map(v => <div className={`diff ${v.type}`}>
                <div>{v.type === "del" || v.type === "normal" ? ++oldY : ""}</div>
                <div>{v.type === "add" || v.type === "normal" ? ++newY : ""}</div>
                <div>
                    <Icon name="annotation" size={16}/>
                </div>
                <div dangerouslySetInnerHTML={{
                    __html: hljs.highlightAuto(v.content, [""]).value
                }}>
                </div>
            </div>)}
        </>
    }

    function renderFileChanges(f: File) {
        const k = `${f.from}=${f.to}`;
        return <div className="file" key={k}>
            <div className="header">
                <div>
                    {f.from}{f.to && f.to !== f.from && `...${f.to}`}
                </div>
                <div>
                    <div className="add">
                        +{f.additions ?? 0}
                    </div>
                    <div className="del">
                        -{f.deletions ?? 0}
                    </div>
                </div>
            </div>
            <div className="body">
                {f.chunks.map(renderChunk)}
            </div>
        </div>
    }

    return <>
        {patch.diff.map(renderFileChanges)}
    </>
}