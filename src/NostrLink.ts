import { NostrPrefix } from "./Nostr";
import { TLVEntryType, decodeTLV } from "./TLV";
import { bech32ToHex, hexToBech32 } from "./Util";

export interface NostrLink {
    type: NostrPrefix;
    id: string;
    kind?: number;
    author?: string;
    relays?: Array<string>;
    encode(): string;
}

export function validateNostrLink(link: string): boolean {
    try {
        const parsedLink = parseNostrLink(link);

        if (!parsedLink) {
            return false;
        }

        if (parsedLink.type === NostrPrefix.PublicKey || parsedLink.type === NostrPrefix.Note) {
            return parsedLink.id.length === 64;
        }

        return true;
    } catch {
        return false;
    }
}

export function parseNostrLink(link: string, prefixHint?: NostrPrefix): NostrLink | undefined {
    const entity = link.startsWith("web+nostr:") || link.startsWith("nostr:") ? link.split(":")[1] : link;

    const isPrefix = (prefix: NostrPrefix) => {
        return entity.startsWith(prefix);
    };

    if (isPrefix(NostrPrefix.PublicKey)) {
        const id = bech32ToHex(entity);
        return {
            type: NostrPrefix.PublicKey,
            id: id,
            encode: () => hexToBech32(NostrPrefix.PublicKey, id),
        };
    } else if (isPrefix(NostrPrefix.Note)) {
        const id = bech32ToHex(entity);
        return {
            type: NostrPrefix.Note,
            id: id,
            encode: () => hexToBech32(NostrPrefix.Note, id),
        };
    } else if (isPrefix(NostrPrefix.Profile) || isPrefix(NostrPrefix.Event) || isPrefix(NostrPrefix.Address)) {
        const decoded = decodeTLV(entity);

        const id = decoded.find(a => a.type === TLVEntryType.Special)?.value as string;
        const relays = decoded.filter(a => a.type === TLVEntryType.Relay).map(a => a.value as string);
        const author = decoded.find(a => a.type === TLVEntryType.Author)?.value as string;
        const kind = decoded.find(a => a.type === TLVEntryType.Kind)?.value as number;

        const encode = () => {
            return entity; // return original
        };
        if (isPrefix(NostrPrefix.Profile)) {
            return {
                type: NostrPrefix.Profile,
                id,
                relays,
                kind,
                author,
                encode,
            };
        } else if (isPrefix(NostrPrefix.Event)) {
            return {
                type: NostrPrefix.Event,
                id,
                relays,
                kind,
                author,
                encode,
            };
        } else if (isPrefix(NostrPrefix.Address)) {
            return {
                type: NostrPrefix.Address,
                id,
                relays,
                kind,
                author,
                encode,
            };
        }
    } else if (prefixHint) {
        return {
            type: prefixHint,
            id: link,
            encode: () => hexToBech32(prefixHint, link),
        };
    } else {
        throw new Error("Invalid nostr link");
    }
}