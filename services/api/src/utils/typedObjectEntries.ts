
export function typedObjectEntries<T extends object>(obj: T){
    const entries = Object.entries(obj) as [keyof T, T[keyof T]][];
    return entries;
}