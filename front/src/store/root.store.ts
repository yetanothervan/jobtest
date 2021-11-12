import { BigDataStore, IBigDataStore } from "./bigData.store";
import { ILocalCacheStore, LocalCacheStore } from "./localCache.store";

export class RootStore {
    bigData: IBigDataStore;
    localCache: ILocalCacheStore;

    constructor() {        
        this.bigData = new BigDataStore(this);
        this.localCache = new LocalCacheStore(this);
    }
}