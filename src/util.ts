export function objectFromEntries<T = any>(entries: [string, T][]): { [k: string]: T } {
    const object: { [k: string]: T } = {};
    for (const [key, value] of entries)
        object[key] = value;
    return object;
}
