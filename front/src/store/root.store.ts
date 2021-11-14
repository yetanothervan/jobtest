import { action, makeObservable, runInAction } from "mobx";
import { bigDataService } from "../services/bigdata.service";
import { BigDataStore, IBigDataStore } from "./bigData.store";
import { ILocalCacheStore, LocalCacheStore } from "./localCache.store";

export class RootStore {
    bigData: IBigDataStore;
    localCache: ILocalCacheStore;

    constructor() {
        this.bigData = new BigDataStore(this);
        this.localCache = new LocalCacheStore(this);
        makeObservable(this);
    }

    @action getNode = (id: string) => {

        action(async () => {

            try {
                const node = await bigDataService.getNode({ id });
                runInAction(() => {
                    if (node !== null) {
                        this.localCache.giveNode(node);
                    }
                });
            } catch (errs: any) {
                console.log("Err: " + errs?.message);
            }
        })();
    }

}