import { action, makeObservable, observable, runInAction } from "mobx";
import { ITreeItem } from "../../../common/models/ITreeItem";
import { bigDataService } from "../services/bigdata.service";
import { RootStore } from "./root.store";

export interface IBigDataStore {
    tree?: ITreeItem[],
    reloadData: () => void,
    getNode: (id: string) => void
}

export class BigDataStore implements IBigDataStore {

    private rootStore: RootStore;

    @observable tree?: ITreeItem[];

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @action reloadData = () => {

        action(async () => {
            try {
                const response = await bigDataService.getData()
                runInAction(() => {
                    this.tree = [response];
                });
            } catch (errs: any) {
                console.log("Err: " + errs?.message);
                this.tree = undefined;
            }
        })();
    }

    @action getNode = (id: string) => {
        this.rootStore.getNode(id);
    }

}
