import { existsSync, mkdirSync } from "fs";
import lodash from "lodash";
import path from "path";
import JSONdb from "simple-json-db";
import DI from "../util/di.js";
const { throttle } = lodash;
class StorageService {
    constructor() {
        const root = path.resolve(process.cwd(), './data');
        const name = 'sjson.db';
        if (!existsSync(root))
            mkdirSync(root);
        this.db = new JSONdb(path.resolve(root, name));
        this.sync = throttle(this.sync, 500);
    }
    get(key) {
        this.sync();
        const r = this.db.get(key);
        return r;
    }
    set(key, value) {
        const r = this.db.set(key, value);
        this.sync();
        return r;
    }
    sync() {
        this.db.sync();
    }
}
const IStorageService = 'IStorageService';
DI.provide(IStorageService, StorageService);
export { IStorageService };
