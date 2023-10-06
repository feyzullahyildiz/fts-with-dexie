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
    const ratingSorted = Array.from(idMap.entries()).sort((a, b) => a[1] > b[1] ? 1 : -1)
    const firstMaxItems = ratingSorted.splice(0, maxRow)
    const idList = firstMaxItems.map(a => a[0])
    return idList;
}
export const search = async (table: Dexie.Table, text: string, maxRow = 10) => {
    const result = await table.where('key').equals(text).toArray();

    let rowCount = 0;
    if (result[0]) {
        rowCount = result[0].idList.length;
    }
    if (maxRow <= rowCount) {
        return getExportedDataFromRows(result, maxRow);
    }
    const likeResult = await table.where('key').startsWith(text).toArray();

    return getExportedDataFromRows(
        [...result, ...likeResult], maxRow
    )

}