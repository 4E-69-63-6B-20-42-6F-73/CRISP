export default function setsAreEqual(a: Set<string>, b: Set<string>): boolean {
    if (a.size !== b.size) return false;
    for (let item of a) {
        if (!b.has(item)) return false;
    }
    return true;
}
