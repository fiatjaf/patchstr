import { useLocation } from "react-router-dom";

import "./PatchReview.css";
import { ParsedPatch } from "./Diff";
import PatchView from "./PathView";

export default function PatchReview() {
    const location = useLocation();

    if (!location.state) {
        return <b>Missing route data</b>
    }

    return <PatchView patch={location.state as ParsedPatch} />
}