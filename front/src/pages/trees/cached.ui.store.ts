import { action, makeObservable, observable, reaction } from "mobx";
import { TreeService } from "../../../../common/models/tree.static";
import { IMenuItem, ITree_UiStore, Tree_UiStore } from "../../components/tree/tree.ui.store";
import { ILocalCacheStore } from "../../store/localCache.store";

interface IRenameDlg {
    visible: boolean,
    id?: string,
    oldName?: string
}

export interface ICached_UiStore {
    myTreeView: ITree_UiStore,
    renameDlg: IRenameDlg,
    showRenameDlg: (id: string, oldName: string) => void,
    cancelRenaming: () => void,
    renameItem: (id: string, newName: string) => void
}

export class Cached_UiStore implements ICached_UiStore {

    myTreeView: ITree_UiStore;
    store: ILocalCacheStore;
    @observable renameDlg: IRenameDlg;

    constructor(store: ILocalCacheStore) {
        this.store = store;
        this.myTreeView = new Tree_UiStore(this.getContextMenu);
        this.renameDlg = {
            visible: false
        }
        makeObservable(this);

        reaction(
            () => this.store.data,
            items => this.myTreeView.data = items, { fireImmediately: true }
        );
    }

    @action showRenameDlg = (id: string, oldName: string) => {
        this.renameDlg = {
            visible: true,
            id,
            oldName
        }
    }

    @action cancelRenaming = () => {
        this.renameDlg = {
            visible: false,
            id: undefined,
            oldName: undefined
        }
    }

    @action renameItem = (id: string, newName: string) => {
        this.store.rename(id, newName);
        this.cancelRenaming();
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
            {
                caption: "Rename", disabled: node.isDeleted, onClick: () => this.showRenameDlg(nodeId, node.caption)
            }
        ]
    }

}


