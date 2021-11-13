import axios from "axios";
import { reqs, routes } from "../../../common";
import { ITreeItem } from "../../../common/models/ITreeItem";

const getData = async (): Promise<ITreeItem> => {
    try {
        const response = await
            axios.get<reqs.bigdata.Response_GetData>(routes.bigdata.getdata);
        return response.data.tree;
    } catch (err: any) {
        throw err;
    }
}

export const bigDataService = {
    getData
}
