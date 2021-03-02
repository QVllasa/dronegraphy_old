export function removeDuplicateObjects(array: any[]) {
    return [...new Set(array.map(s => JSON.stringify(s)))]
        .map(s => JSON.parse(s));
}
