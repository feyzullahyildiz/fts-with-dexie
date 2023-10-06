import Dexie from "dexie"
import { getMockDexie } from "./utils"
import { getTable, initTable } from "../lib"
import { ConfigType, RecommendedSlugifyAllowedCharacters, parseData } from 'fts-with-dexie-core';
import { slugify } from 'transliteration';
import { insertBulkData } from "../lib/insertData";
import { search } from "../lib/search";

const mySlugify = (str: string) => slugify(str, { allowedChars: RecommendedSlugifyAllowedCharacters });

const sortByKeyFun = (a: any, b: any) => a.key > b.key ? 1 : -1

describe('search', () => {
    let db: Dexie = null!;
    let table: Dexie.Table = null!;
    beforeAll(() => {
        db = getMockDexie();
        initTable(db);
        table = getTable(db);
    })
    const config: ConfigType = {
        idPropertyName: 'id',
        ftsFieldNames: ['title', "desc"],
        ftsFieldWeights: [1.2, 1],
    }

    it('insert movies', async () => {
        const data = [
            {
                id: 1,
                title: mySlugify('Yıldızlar Arası'),
                desc: mySlugify('Yıldızlar arası seyahatlerin hikayesi ve insanlığın hayatta kalma mücadelesi'),
            },
            {
                id: 2,
                title: mySlugify('Esaretin Bedeli'),
                desc: mySlugify('Bir mahkumun hikayesi ve umutla dolu mücadelesi.'),
            },
            {
                id: 3,
                title: mySlugify('Matrix'),
                desc: mySlugify('Sanal gerçeklik dünyasında geçen aksiyon dolu bir bilim kurgu.'),
            }
        ]
        const parsedDatas = data.map(item => parseData(config, item));
        await insertBulkData(table, parsedDatas);
        const datas = await table.toArray();
        expect(datas.sort(sortByKeyFun)).toEqual([
            { key: 'aksiyon', idList: [3], ratingList: [1] },
            { key: 'arasi', idList: [1], ratingList: [2.2] },
            { key: 'bedeli', idList: [2], ratingList: [1.2] },
            { key: 'bilim', idList: [3], ratingList: [1] },
            { key: 'bir', idList: [2, 3], ratingList: [1, 1] },
            { key: 'dolu', idList: [2, 3], ratingList: [1, 1] },
            { key: 'dunyasinda', idList: [3], ratingList: [1] },
            { key: 'esaretin', idList: [2], ratingList: [1.2] },
            { key: 'gecen', idList: [3], ratingList: [1] },
            { key: 'gerceklik', idList: [3], ratingList: [1] },
            { key: 'hayatta', idList: [1], ratingList: [1] },
            { key: 'hikayesi', idList: [1, 2], ratingList: [1, 1] },
            { key: 'insanligin', idList: [1], ratingList: [1] },
            { key: 'kalma', idList: [1], ratingList: [1] },
            { key: 'kurgu', idList: [3], ratingList: [1] },
            { key: 'mahkumun', idList: [2], ratingList: [1] },
            { key: 'matrix', idList: [3], ratingList: [1.2] },
            { key: 'mucadelesi', idList: [1, 2], ratingList: [1, 1] },
            { key: 'sanal', idList: [3], ratingList: [1] },
            { key: 'seyahatlerin', idList: [1], ratingList: [1] },
            { key: 'umutla', idList: [2], ratingList: [1] },
            { key: 've', idList: [1, 2], ratingList: [1, 1] },
            { key: 'yildizlar', idList: [1], ratingList: [2.2] }
        ].sort(sortByKeyFun))

    });
    it('should search', async () => {
        const ids = await search(table, 'yildizlar')
        expect(ids).toEqual([1])
    })
})