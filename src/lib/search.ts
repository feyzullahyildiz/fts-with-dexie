import Dexie from "dexie";

type Row = {
    key: string;
    idList: Array<number | string>;
    ratingList: Array<number>;
}
const getExportedDataFromRows = (rows: Row[], maxRow: number) => {
    const idMap = new Map<number | string, number>();
    for (const row of rows) {
        for (let i = 0; i < row.idList.length; i++) {
            const idValue = row.idList[i];
            const ratingValue = row.ratingList[i];
            const totalRatingValue = idMap.get(idValue) || 0;
            idMap.set(idValue, totalRatingValue + ratingValue)
        }
    }
    const ratingSorted = Array.from(idMap.entries()).sort((a, b) => a[1] < b[1] ? 1 : -1)
    const firstMaxItems = ratingSorted.splice(0, maxRow)
    const idList = firstMaxItems.map(a => a[0])
    return idList;
}

export const search = async (table: Dexie.Table, text: string | Array<string>, maxRow = 10) => {
    const searchKey = typeof text === 'string' ? [text] : text;
    const rows = await table.where('key').startsWithAnyOf(searchKey).toArray();
    if (rows.length === 0) {
        return [];
    }
    return getExportedDataFromRows(rows, maxRow)
}
// export const fastSearch = async (table: Dexie.Table, text: string | Array<string>, maxRow = 10) => {
//     const searchKey = typeof text === 'string' ? [text] : text;
//     const rows = await table.where('key').anyOf(searchKey).toArray();
//     if (rows.length === 0) {
//         return [];
//     }
//     return getExportedDataFromRows(rows, maxRow)
// }
