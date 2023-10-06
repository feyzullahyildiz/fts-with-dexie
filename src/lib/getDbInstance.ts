import Dexie from "dexie";

export const getDbInstance = (dbName: string = "fts_with_dexie") => {
    return new Dexie(dbName);
}

