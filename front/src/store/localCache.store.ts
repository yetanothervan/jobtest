import { action, makeObservable, observable } from "mobx";
import { data } from "msw/lib/types/context";
import { ITreeItem } from "../../../common/models/ITreeItem";
import { TreeService } from "../../../common/models/tree.static";
import { RootStore } from "./root.store";

export interface ILocalCacheStore {
    data?: ITreeItem[],
    giveNode: (node: ITreeItem) => void,
    rename: (nodeId: string, newName: string) => void
}

export class LocalCacheStore implements ILocalCacheStore {

    private rootStore: RootStore;

    @observable data?: ITreeItem[];

    constructor(rootStore: RootStore) {
        this.data = undefined;
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @action giveNode = (node: ITreeItem) => {

        // if tree is empty
        if (this.data === undefined) {
            this.data = [node];
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
            if (node) {
                node.caption = newName;
            }
        }


    }

}
