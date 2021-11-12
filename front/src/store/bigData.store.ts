import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./root.store";

export interface IBigDataStore {
    data?: string
}

export class BigDataStore implements IBigDataStore {

    private rootStore: RootStore;

    @observable data?: string

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

}
