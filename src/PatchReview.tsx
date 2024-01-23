import { useLocation } from "react-router-dom";

import "./PatchReview.css";
import { ParsedPatch } from "./Diff";
import PatchView from "./PathView";
import PatchFileList from "./PatchFileList";

export default function PatchReview() {
    const location = useLocation();
    if (!location.state) {
        return <b>Missing route data</b>
    }

    return <div className="patch-review">
        <div>
            <PatchFileList patch={location.state as ParsedPatch} />
        </div>
        <div>
            <PatchView patch={location.state as ParsedPatch} />
        </div>
    </div>
}
