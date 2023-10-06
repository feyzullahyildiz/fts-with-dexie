import Dexie from "dexie";

export const insertData = async (table: Dexie.Table, data: any[][]) => {
    for (const item of data) {
        const [key, id, rating] = item;
        const collection = await table.where('key').equals(key);
        const inserted = (await collection.toArray()).length > 0;
        if (!inserted) {
            await table.add({ key, idList: [id], ratingList: [rating] });
        } else {
            await collection.modify((data) => {
                const index = data.idList.indexOf(id);
                if (index === -1) {
                    data.idList.push(id);
                    data.ratingList.push(rating);
                } else {
                    data.ratingList[index] += rating;
                }
            })
        }
    }
}
export const insertBulkData = async (table: Dexie.Table, datas: any[][][]) => {
    for (const data of datas) {
        await insertData(table, data);
    }
}
