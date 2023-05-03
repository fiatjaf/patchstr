import { useMemo } from "react";

import "./PatchFileList.css";
import { ParsedPatch } from "./Diff";
import Icon from "./Icon";

interface NodeTree {
    isDir: boolean
    name: string
    children: NodeTree[]
}

export default function PatchFileList({ patch }: { patch: ParsedPatch }) {
    const tree = useMemo(() => {
        const ret = {
            isDir: true,
            name: "/",
            children: []
        } as NodeTree;

        function addAndRecurse(a: string[], atNode: NodeTree) {
            if (a.length > 1) {
                const newdir = a.shift()!;
                let existingNode = atNode.children.find(a => a.name === newdir);
                if (!existingNode) {
                    existingNode = {
                        isDir: true,
                        name: newdir,
                        children: []
                    };
                    atNode.children.push(existingNode);
                }
                addAndRecurse(a, existingNode);
            } else {
                atNode.children.push({
                    isDir: false,
                    name: a[0],
                    children: []
                });
            }
        }

        const split = patch.diff
            .map(a => (a.to ?? a.from ?? ".")?.split("/"))
            .sort((a, b) => a.length - b.length);

        split.forEach(a => addAndRecurse(a, ret));
        return ret;
    }, [patch]);

    function renderNode(n: NodeTree): React.ReactNode {
        if (n.isDir && n.name === "/") {
            // skip first node and just render children
            return <>
                {n.children.sort(a => a.isDir ? -1 : 1).map(b => renderNode(b))}
            </>
        } else if (n.isDir) {
            return <>
                <div className="tree-item">
                    <Icon name="folder"/>
                    {n.name}
                </div>
                <div className="tree-dir">
                    {n.children.sort(a => a.isDir ? -1 : 1).map(b => renderNode(b))}
                </div>
            </>
        } else {
            return <div className="tree-item">
                <Icon name="file" />
                {n.name}
            </div>
        }
    }

    return <div className="tree">
        {renderNode(tree)}
    </div>
}