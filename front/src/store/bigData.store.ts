import { action, makeObservable, observable, runInAction } from "mobx";
import { IAddPending } from "../../../common/models/IAddPending";
import { IRenamePending } from "../../../common/models/IRenamePending";
import { ITreeItem } from "../../../common/models/ITreeItem";
import { bigDataService } from "../services/bigdata.service";
import { RootStore } from "./root.store";

export interface IBigDataStore {
    tree?: ITreeItem[],
    reloadData: () => void,
    getNode: (id: string) => void,
    reset: () => void,
    apply: (renamePending: IRenamePending[], addPending: IAddPending[], deletePending: string[]) => void
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

    @action reset = () => {

        action(async () => {
            try {
                await bigDataService.reset();
                const response = await bigDataService.getData();
                runInAction(() => {
                    this.tree = [response];
                });
            } catch (errs: any) {
                console.log("Err: " + errs?.message);
                this.tree = undefined;
            }
        })();

    }

    @action apply = (renamePending: IRenamePending[], addPending: IAddPending[], deletePending: string[]) => {

        action(async () => {
            try {
                await bigDataService.apply({
                    addPending,
                    deletePending,
                    renamePending
                });
                this.reloadData();
            } catch (errs: any) {
                console.log("Err: " + errs?.message);
            }
        })();
    }

}
