import { reaction } from "mobx";
import { TreeService } from "../../../../../common/models/tree.static";
import { IMenuItem, ITree_UiStore, Tree_UiStore } from "../../../components/tree/tree.ui.store";
import { IBigDataStore } from "../../../store/bigData.store";

export interface IBigData_UiStore {
    myTreeView: ITree_UiStore
}

export class BigData_UiStore implements IBigData_UiStore {

    myTreeView: ITree_UiStore;
    store: IBigDataStore;

    constructor(store: IBigDataStore) {
        this.store = store;
        this.myTreeView = new Tree_UiStore(this.getContextMenu);

        // makeObservable(this);

        reaction(
            () => this.store.tree,
            items => this.myTreeView.data = items, { fireImmediately: true }
        );
    }

    getContextMenu = (nodeId: string): IMenuItem[] | null => {

        if (this.store.tree === undefined) {
            return null;
        }

        const node = TreeService.findItem(nodeId, this.store.tree);
        if (node === null) {
            return null;
        }

        return [
            { caption: "Забрать", disabled: false, onClick: () => this.store.getNode(nodeId) }
        ]
    }

}


