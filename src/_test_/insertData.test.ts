import Dexie from "dexie"
import { getMockDexie } from "./utils"
import { getTable, initTable } from "../lib"
import { ConfigType, RecommendedSlugifyAllowedCharacters, parseData } from 'fts-with-dexie-core';
import { slugify } from 'transliteration';
import { insertData } from "../lib/insertData";

const mySlugify = (str: string) => slugify(str, { allowedChars: RecommendedSlugifyAllowedCharacters });

const sortByKeyFun = (a: any, b: any) => a.key > b.key ? 1 : -1

describe('insertData', () => {
    let db: Dexie = null!;
    let table: Dexie.Table = null!;
    beforeEach(() => {
        db = getMockDexie();
        initTable(db);
        table = getTable(db);
    })
    it('should table row count 0', async () => {
        const c = await table.count();
        expect(c).toBe(0);
    })
    describe('config', () => {
        let db: Dexie = null!;
        let table: Dexie.Table = null!;
        beforeAll(() => {
            db = getMockDexie();
            initTable(db);
            table = getTable(db);
        })
        const config: ConfigType = {
            idPropertyName: 'id',
            ftsFieldNames: ['title'],
            ftsFieldWeights: [1.2],
        }

        it('insert Ali Duru', async () => {
            const obj = {
                id: 1,
                title: mySlugify('Ali Duru'),
            }
            const parsedData = parseData(config, obj);
            await insertData(table, parsedData);
            const datas = await table.toArray();
            expect(datas.sort(sortByKeyFun)).toEqual([
                { key: 'ali', idList: [1], ratingList: [1.2] },
                { key: 'duru', idList: [1], ratingList: [1.2] },
            ].sort(sortByKeyFun))
        });

        it('insertData Ali Veli', async () => {
            const obj = {
                id: 2,
                title: mySlugify('Ali veli'),
            }
            const parsedData = parseData(config, obj);
            await insertData(table, parsedData);
            const datas = await table.toArray();
            expect(datas.sort(sortByKeyFun)).toEqual([
                { key: 'ali', idList: [1, 2], ratingList: [1.2, 1.2] },
                { key: 'duru', idList: [1], ratingList: [1.2] },
                { key: 'veli', idList: [2], ratingList: [1.2] },
            ].sort(sortByKeyFun))
        });
        it('insertData Yilmaz Yilmaz', async () => {
            const obj = {
                id: 3,
                title: mySlugify('yilmaz asla Yılmaz'),
            }
            const parsedData = parseData(config, obj);
            await insertData(table, parsedData);
            const datas = await table.toArray();
            expect(datas.sort(sortByKeyFun)).toEqual([
                { key: 'ali', idList: [1, 2], ratingList: [1.2, 1.2] },
                { key: 'duru', idList: [1], ratingList: [1.2] },
                { key: 'veli', idList: [2], ratingList: [1.2] },
                { key: 'yilmaz', idList: [3], ratingList: [2.4] },
                { key: 'asla', idList: [3], ratingList: [1.2] },
            ].sort(sortByKeyFun))
        });

    })
})