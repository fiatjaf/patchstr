import { Event } from 'nostr-tools/pure';

export interface ParsedRepo {
    id: string
    created: number
    pubkey: string
    name: string
    description: string
    head: string
    web: string[]
    clone: string[]
    patches: string[]
    issues: string[]
    relay: string | undefined
}

export function parseRepoEvent(ev: Event): ParsedRepo {
    let parsed: Partial<ParsedRepo> = {
        created: ev.created_at,
        pubkey: ev.pubkey,
        web: [],
        clone: [],
        patches: [],
        issues: [],
        relay: undefined
    };

    ev.tags.forEach(tag => {
        switch (tag[0]) {
          case 'd':
            parsed.id = tag[1]
            break
          case 'name':
            parsed.name = tag[1]
            break
          case 'description':
            parsed.description = tag[1]
            break
          case 'head':
            parsed.head = tag[1]
            break
          case 'web':
            parsed.web?.push?.(tag[1])
            break
          case 'clone':
            parsed.clone?.push?.(tag[1])
            break
          case 'patches':
            parsed.patches?.push?.(tag[1])
            break
          case 'issues':
            parsed.issues?.push?.(tag[1])
            break
        }
    })

    return parsed as ParsedRepo
}
