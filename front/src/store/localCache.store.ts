import { action, makeObservable, observable } from "mobx";
import { ITreeItem } from "../../../common/models/ITreeItem";
import { RootStore } from "./root.store";

export interface ILocalCacheStore {
    data?: ITreeItem[]
}

export class LocalCacheStore implements ILocalCacheStore {

    private rootStore: RootStore;

    @observable data?: ITreeItem[];

    constructor(rootStore: RootStore) {
        this.data = [];
        this.rootStore = rootStore;
        makeObservable(this);
    }

}
