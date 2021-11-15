import { action, makeObservable, reaction } from "mobx";
import React from "react";
import { RootStore } from "../../store";
import { BigData_UiStore, IBigData_UiStore } from "./bigData.ui.store";
import { Cached_UiStore, ICached_UiStore } from "./cached.ui.store";

export interface ITreesPage_UiStore {
    bigDataTree: IBigData_UiStore,
    cachedDataTree: ICached_UiStore,
    apply: () => void,
    reset: () => void
}

export const TreesPage_UiStoreContext =
    React.createContext<ITreesPage_UiStore>({} as ITreesPage_UiStore);

export class TreesPages_UiStore implements ITreesPage_UiStore {

    bigDataTree: IBigData_UiStore;
    cachedDataTree: ICached_UiStore;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.bigDataTree = new BigData_UiStore(this.rootStore.bigData);
        this.cachedDataTree = new Cached_UiStore(this.rootStore.localCache);
        makeObservable(this);

    }

    @action apply = () => {
        this.rootStore.applyChanges();
    }

    @action reset = () => {
        this.rootStore.resetState();
    }

}