import { action, makeObservable, observable } from "mobx";
import { v4 } from "uuid";
import { IAddPending } from "../../../common/models/IAddPending";
import { IRenamePending } from "../../../common/models/IRenamePending";
import { ITreeItem } from "../../../common/models/ITreeItem";
import { TreeService } from "../../../common/models/tree.static";
import { RootStore } from "./root.store";

export interface ILocalCacheStore {
    data?: ITreeItem[],
    giveNode: (node: ITreeItem) => void,
    rename: (nodeId: string, newName: string) => void,
    delete: (nodeId: string) => void,
    addNode: (parentId: string, caption: string) => void,
    clear: () => void,
    apply: () => void
}

export class LocalCacheStore implements ILocalCacheStore {

    private rootStore: RootStore;

    @observable data?: ITreeItem[];

    @observable /*private*/ pendingDelete: string[];

    @observable /*private*/ pendingRename: IRenamePending[];

    @observable /*private*/ pendingNew: IAddPending[];

    constructor(rootStore: RootStore) {
        this.data = undefined;
        this.rootStore = rootStore;
        this.pendingDelete = [];
        this.pendingNew = [];
        this.pendingRename = [];
        makeObservable(this);
    }

    @action clear = () => {
        this.pendingDelete = [];
        this.pendingNew = [];
        this.pendingRename = [];
        this.data = undefined;
    }

    @action giveNode = (node: ITreeItem) => {

        // if tree is empty
        if (this.data === undefined) {
            this.data = [node];
            return;
        }

        // search for the same node
        const sameNode = TreeService.findItem(node.id, this.data);
        if (sameNode !== null) { // update from DB            
            sameNode.caption = node.caption;
            sameNode.isDeleted = node.isDeleted;
            return;
        }

        // seek all children
        const children = this.data.filter(n => n.parentId === node.id);
        for (const child of children) {
            node.children.push(child);
            this.data = [...this.data.filter(n => n.id !== child.id)];
        }

        // seek all parents
        if (node.parentId) {
            const parent = TreeService.findItem(node.parentId, this.data);
            if (parent !== null) {
                parent.children.push(node);
            } else {
                this.data = [...this.data, node];
            }
        }

        // root node
        if (node.parentId == undefined) {
            this.data = [...this.data, node];
        }
    }

    @action rename = (nodeId: string, newName: string) => {
        if (this.data) {
            const node = TreeService.findItem(nodeId, this.data);
            if (node && node.caption !== newName) {
                node.caption = newName;
                
                // find toAdd pending (in case new file renaming)
                const toAddPending = this.pendingNew.find(p => p.id === nodeId);
                if (toAddPending !== undefined) {
                    toAddPending.caption = newName;
                    return;
                }

                // find rename pending
                const pending = this.pendingRename.find(p => p.id === nodeId);
                if (pending !== undefined) {
                    pending.newCaption = newName;
                } else {
                    this.pendingRename.push({
                        id: nodeId,
                        newCaption: newName
                    })
                }


            }
        }
    }

    @action delete = (nodeId: string) => {
        if (this.data) {
            const node = TreeService.findItem(nodeId, this.data);
            if (node) {
                node.isDeleted = true;
                for (const child of node.children) {
                    child.isDeleted = true;
                }
            }
        }
    }

    @action addNode = (parentId: string, caption: string) => {

        if (this.data) {
            const parent = TreeService.findItem(parentId, this.data);
            if (parent && !parent.isDeleted) {
                const id = v4();
                parent.children.push({
                    caption,
                    id,
                    children: [],
                    isDeleted: false,
                    parentId
                });
                this.pendingNew.push({
                    parentId,
                    caption,
                    id 
                });
            }
        }
    }

    @action apply = () => {
        this.rootStore.bigData.apply(this.pendingRename, this.pendingNew, this.pendingDelete);

        this.pendingRename = [];
        this.pendingDelete = [];
        this.pendingNew = [];
    }

}
