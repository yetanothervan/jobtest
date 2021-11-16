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

        // func
        const removeFromPending = (pId: string) => {
            if (this.pendingRename.find(p => p.id === pId)) {
                this.pendingRename = this.pendingRename.filter(p => p.id !== pId);
            }
            if (this.pendingDelete.find(p => p === pId)) {
                this.pendingDelete = this.pendingDelete.filter(p => p !== pId);
            }
        }

        // if tree is empty
        if (this.data === undefined) {
            this.data = [node];
            this.deleteRecalculate();
            return;
        }

        // search for the same node
        const sameNode = TreeService.findItem(node.id, this.data);
        if (sameNode !== null) { // update from DB
            sameNode.caption = node.caption;
            sameNode.isDeleted = node.isDeleted;
            sameNode.pendingApply = false;
            sameNode.pendingDelete = false;
            removeFromPending(sameNode.id);
            this.deleteRecalculate();
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

        this.deleteRecalculate();
    }

    @action rename = (nodeId: string, newName: string) => {

        // return if no data
        if (this.data == undefined) {
            return;
        }

        // return if no node or same caption
        const node = TreeService.findItem(nodeId, this.data);
        if (node === null || node.caption === newName) return;

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
        } else {  // create new rename pending
            this.pendingRename.push({
                id: nodeId,
                newCaption: newName
            })
        }

        // do rename
        node.caption = newName;
        node.pendingApply = true;
    }

    @action delete = (nodeId: string) => {

        // return if no data
        if (this.data == undefined) {
            return;
        }

        //return if no node
        const node = TreeService.findItem(nodeId, this.data);
        if (node === null) {
            return;
        }

        //return if already in pending delete
        if (this.pendingDelete.find(p => p == nodeId) !== undefined) {
            return;
        }

        //add to pending, recalculate delete
        this.pendingDelete.push(nodeId);
        this.deleteRecalculate();
    }

    @action deleteRecalculate = () => {
        // return if no data
        if (this.data == undefined) {
            return;
        }

        TreeService.applyToAll(this.data, (parent, item) => {

            const removeFromPending = (pId: string) => {
                if (this.pendingDelete.includes(pId)) {
                    this.pendingDelete = this.pendingDelete.filter(p => p !== pId);
                }
            }

            if (item.isDeleted) {
                return;
            }

            if (parent?.isDeleted) {
                item.isDeleted = true;
                item.pendingDelete = false;
                removeFromPending(item.id);
                return;
            }

            if (parent?.pendingDelete) {
                item.pendingDelete = true;
                return;
            }

            if (this.pendingDelete.includes(item.id)) {
                item.pendingDelete = true;
                return;
            }

            item.pendingDelete = false;
        });
    }

    @action addNode = (parentId: string, caption: string) => {

        // return if no data
        if (this.data == undefined) {
            return;
        }

        const parent = TreeService.findItem(parentId, this.data);
        if (parent && !parent.isDeleted && !parent.pendingDelete) {
            const id = v4();
            parent.children.push({
                caption,
                id,
                children: [],
                isDeleted: false,
                parentId,
                pendingApply: true,
                pendingDelete: false
            });
            this.pendingNew.push({
                parentId,
                caption,
                id
            });
        }
    }

    @action apply = () => {
        this.rootStore.bigData.apply(this.pendingRename, this.pendingNew, this.pendingDelete);

        if (this.data) {
            TreeService.applyToAll(this.data, (parent, item) => {
                item.pendingApply = false;
                if (item.pendingDelete) {
                    item.isDeleted = true;
                    item.pendingDelete = false;
                }
            })
        }

        this.pendingRename = [];
        this.pendingDelete = [];
        this.pendingNew = [];
    }

}
