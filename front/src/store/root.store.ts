import { action, makeObservable, runInAction } from "mobx";
import { IAddPending } from "../../../common/models/IAddPending";
import { IRenamePending } from "../../../common/models/IRenamePending";
import { ITreeItem } from "../../../common/models/ITreeItem";
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

    @action getBulkNodes = (ids: string[]) => {

        action(async () => {

            const requests = ids.map(id => () => new Promise<ITreeItem | null>(
                async (res, rej) => res(await bigDataService.getNode({ id }))
            ));

            try {
                const nodes = await Promise.all(requests.map(f => f()));
                runInAction(() => {
                    for (const node of nodes) {
                        if (node !== null) {
                            this.localCache.giveNode(node);
                        }
                    }
                });
            } catch (errs: any) {
                console.log("Err: " + errs?.message);
            }
        })();
    }

    @action resetState = () => {
        this.localCache.clear();
        this.bigData.reset();
    }

    @action applyChanges = () => {
        this.localCache.apply();
    }

}