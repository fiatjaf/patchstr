import { useEffect, useState } from "react"
import { Nostr } from "./App"

export interface Metadata {
    name?: string
    display_name?: string
    about?: string
    picture?: string
    lud06?: string
    lud16?: string
    nip05?: string
}
export default function useProfile(key: string) {
    const [profile, setProfile] = useState<Metadata>();

    useEffect(() => {
        Nostr.fetchAndCacheMetadata(key)
            .then((v: any) => {
                const meta = JSON.parse(v.content) as Metadata;
                setProfile(meta);
            })
            .catch(console.error);
    }, []);

    return profile;
}
