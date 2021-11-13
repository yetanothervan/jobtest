import { action, makeObservable, observable, reaction } from "mobx";
import { ITreeItem } from "../../../../common/models/ITreeItem";


export interface ITree_UiStore {
    data?: ITreeItem[],

    expanded: string[],
    setExpanded: (nodes: string[]) => void
}

export class Tree_UiStore implements ITree_UiStore {

    @observable data?: ITreeItem[];

    @observable expanded: string[];
    @action setExpanded = (nodes: string[]) => {
        this.expanded = nodes;
    }

    constructor() {
        this.expanded = [];
        makeObservable(this);

        // auto expand root element
        reaction(
            () => this.data,
            data => {
                if (data !== undefined && data.length > 0) {
                    if (!this.expanded.includes(data[0].id)) {
                        this.expanded.push(data[0].id);
                    }
                }
            }, { fireImmediately: true }
        );
    }
}