# How to use
### Before usage
You need to prepare your data with [fts-with-dexie-core](https://www.npmjs.com/package/fts-with-dexie-core). You can prepare the data from client-side or from backend (nodejs)
### Usage
```js
import { 
    getDbInstance,
    initTable,
    getTable,
    clearTable,
    insertData,
    insertBulkData,
    search,
 } from "fts-with-dexie";
import { slugify } from "transliteration";

const mySlugify = (str) => {
  return slugify(str, {
    allowedChars: RecommendedSlugifyAllowedCharacters,
  });
};
const ftsDataProvider = async () => {
    // If you want to serve your data in backend. Prepare the data with fts-with-dexie-core and serve it
    if("I already prepared the data in server side ??") {
        // Your JSON, you can prepare this data with fts-with-dexie-core client-side OR backend Side
        const ftsReadyData = await fetch("/api/ftsReadyDatas").then(res => res.json());
        return ftsReadyData
    }
    // If you say, I am going to prepare the data here. Use fts-with-dexie-core
    // https://www.npmjs.com/package/fts-with-dexie-core


}
const db = getDbInstance("MY-DEFAULT-FTS-DB");
await initTable(db);
const table = getTable(db);
const ftsReadyData = await ftsDataProvider();
await insertBulkData(table, ftsReadyData);

const idList = await search(table, mySlugify("the godfathe").split("-")); // [1,2]


```