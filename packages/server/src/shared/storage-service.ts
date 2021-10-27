import { singleton } from "tsyringe";
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import JSONdb from "simple-json-db";

export const defaultRoot = resolve(process.cwd(), "data");
export const defaultFilename = "common.db";

export interface IStorageService {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
}

@singleton()
export class StorageService implements IStorageService {
  private _db: JSONdb;
  private _root: string = defaultRoot;
  private _filename: string = defaultFilename;
  constructor() {
    if (!existsSync(this._root)) mkdirSync(this._root);
    this._db = new JSONdb(resolve(this._root, this._filename));
  }

  get<T>(key: string) {
    return this._db.get(key) as unknown as T;
  }

  set<T>(key: string, value: T) {
    return this._db.set(key, value as unknown as object);
  }

  delete(key: string) {
    return this._db.delete(key);
  }
}

export const StorageServiceIdentifier = "StorageService";
