// import "fake-indexeddb/auto";
import Dexie from "dexie";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";

const randomDBName = () => Math.ceil(Math.random() * 1000000).toString()
export const getMockDexie = ( ) => {
    const dbName = randomDBName();
    return new Dexie(dbName, { indexedDB, IDBKeyRange });
}