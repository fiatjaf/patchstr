import { useState } from "react";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import LightningFS from "@isomorphic-git/lightning-fs";

import "./NewPatch.css";

const fs = new LightningFS("patchstr-fs");

export default function NewPatch() {
    const [subject, setSubject] = useState("");
    const [diff, setDiff] = useState("");
    const [repo, setRepo] = useState("");
    const [relay, setRelay] = useState("");

    async function testRepo() {
        const testDir = `/${new Date().getTime() / 1000}_test`;
        await git.init({
            fs,
            dir: testDir
        })
        await git.addRemote({
            fs,
            dir: testDir,
            remote: "upstream",
            url: repo
        });
        const info = await git.fetch({
            fs,
            http,
            remote: "upstream",
            dir: testDir,
            corsProxy: "https://cors.isomorphic-git.org"
        });
        fs.rmdir(testDir, undefined, console.error);
        console.debug(info);
    }

    return <div className="new-patch">
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
        <button onClick={() => testRepo()}>
            Submit
        </button>
    </div>
}