import Dexie from "dexie"
import { getMockDexie } from "./utils"
import { getTable, initTable } from "../lib"

describe('initTable', () => {
    let db: Dexie = null!;
    beforeEach(() => {
        db = getMockDexie();
    })
    it('should get Table Instance', () => {
        expect(() => getTable(db)).toThrowError('Table fts does not exist')
        initTable(db);
        expect(getTable(db)).toBeTruthy();
    })
})