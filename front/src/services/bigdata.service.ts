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

const getNode = async (req: reqs.bigdata.Request_GetNode): Promise<ITreeItem | null> => {
    try {
        const response = await
            axios.post<reqs.bigdata.Response_GetNode>(routes.bigdata.getnode, req);
        return response.data.node;
    } catch (err: any) {
        throw err;
    }
}

const reset = async () => {
    try {
        await axios.get<reqs.bigdata.Response_Reset>(routes.bigdata.reset);
    } catch (err: any) {
        throw err;
    }
}

const apply = async (req: reqs.bigdata.Request_Apply) => {
    try {
        await axios.post(routes.bigdata.apply, req);
    } catch (err: any) {
        throw err;
    }
}

export const bigDataService = {
    getData,
    getNode,
    reset,
    apply
}
