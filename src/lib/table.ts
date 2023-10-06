import Dexie, { Table } from "dexie";

export const initTable = async (db: Dexie, version = 1) => {
    db.version(version).stores({
        fts: `++key, idList, ratingList`,
    });
}
export const getTable = (db: Dexie): Table => {
    return db.table('fts');
}

export const clearTable = (db: Dexie) => {
    return db.delete()
}