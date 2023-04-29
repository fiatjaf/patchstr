import { bech32 } from "bech32";
import { etc } from "@noble/secp256k1";

import { NostrPrefix } from "./Nostr";
import { encodeTLV } from "./TLV";

export function bech32ToHex(str: string) {
    try {
        const nKey = bech32.decode(str, 1_000);
        const buff = bech32.fromWords(nKey.words);
        return etc.bytesToHex(Uint8Array.from(buff));
    } catch {
        return str;
    }
}

export function hexToBech32(hrp: string, hex?: string) {
    if (typeof hex !== "string" || hex.length === 0 || hex.length % 2 !== 0) {
        return "";
    }

    try {
        if (hrp === NostrPrefix.Note || hrp === NostrPrefix.PrivateKey || hrp === NostrPrefix.PublicKey) {
            const buf = etc.hexToBytes(hex);
            return bech32.encode(hrp, bech32.toWords(buf));
        } else {
            return encodeTLV(hex, hrp as NostrPrefix);
        }
    } catch (e) {
        console.warn("Invalid hex", hex, e);
        return "";
    }
}

export function unixNowMs() {
    return new Date().getTime();
}

export function unwrap<T>(value?: T) {
    if (!value) {
        throw new Error("Missing value");
    }
    return value;
}