import { reaction } from "mobx";
import React from "react";
import { ITree_UiStore, Tree_UiStore } from "../../components/tree/tree.ui.store";
import { RootStore } from "../../store";

export interface ITreesPage_UiStore {
    bigDataTree: ITree_UiStore,
    cachedDataTree: ITree_UiStore
}

export const TreesPage_UiStoreContext =
    React.createContext<ITreesPage_UiStore>({} as ITreesPage_UiStore);

export class TreesPages_UiStore implements ITreesPage_UiStore {

    bigDataTree: ITree_UiStore;
    cachedDataTree: ITree_UiStore;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.bigDataTree = new Tree_UiStore();
        this.cachedDataTree = new Tree_UiStore();
        // makeObservable(this);

        reaction(
            () => this.rootStore.bigData.tree,
            items => this.bigDataTree.data = items, { fireImmediately: true }
        );

    }

}