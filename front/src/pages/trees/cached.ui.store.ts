import { reaction } from "mobx";
import { TreeService } from "../../../../common/models/tree.static";
import { IMenuItem, ITree_UiStore, Tree_UiStore } from "../../components/tree/tree.ui.store";
import { ILocalCacheStore } from "../../store/localCache.store";

export interface ICached_UiStore {
    myTreeView: ITree_UiStore;
}

export class Cached_UiStore implements ICached_UiStore {

    myTreeView: ITree_UiStore;
    store: ILocalCacheStore;

    constructor(store: ILocalCacheStore) {
        this.store = store;
        this.myTreeView = new Tree_UiStore(this.getContextMenu);
        // makeObservable(this);

        reaction(
            () => this.store.data,
            items => this.myTreeView.data = items, { fireImmediately: true }
        );
    }

    getContextMenu = (nodeId: string): IMenuItem[] | null => {
        if (this.store.data === undefined) {
            return null;
        }

        const node = TreeService.findItem(nodeId, this.store.data);
        if (node === null) {
            return null;
        }

        return [
            { caption: "Take", disabled: false, onClick: () => { } }
        ]
    }

}


