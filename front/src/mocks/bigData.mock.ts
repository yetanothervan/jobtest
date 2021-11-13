import { rest } from "msw";
import { reqs, routes } from "../../../common";
import { ITreeItem } from "../../../common/models/ITreeItem";
import { createTree } from "./data/wholeTree";

export const bigDataMocks = [

    rest.get<{}, reqs.bigdata.Response_GetData,
        { tree: ITreeItem }>(routes.bigdata.getdata, (req, res, ctx) => {
            const tree = createTree();
            return res(ctx.json({
                tree
            }));
        }),
]