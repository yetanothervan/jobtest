import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./root.store";

export interface ILocalCacheStore {
    data?: string
}

export class LocalCacheStore implements ILocalCacheStore {

    private rootStore: RootStore;

    @observable data?: string;

    constructor(rootStore: RootStore) {        
        this.rootStore = rootStore;
        makeObservable(this);
    }

}
