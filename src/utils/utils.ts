
export function algorithmToNiceName(alg: string) {
    switch (alg) {
        case "CP_SAT":
            return "CP SAT"
    }
    return alg
}



export const groupBySingle = function <T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
    let t: Record<K, T> = list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = currentItem;
        else console.error(`duplicate data in groupBySingle - key ${JSON.stringify(group)} maps for ${previous[group]} and ${currentItem}`)
        return previous;
    }, {} as Record<K, T>);
    return t;
};
