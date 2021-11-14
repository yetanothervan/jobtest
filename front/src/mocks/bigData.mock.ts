import { rest } from "msw";
import { reqs, routes } from "../../../common";
import { ITreeItem } from "../../../common/models/ITreeItem";
import { TreeService } from "../../../common/models/tree.static";
import { createTree } from "./data/wholeTree";

const treeKey = "TREE";

const getOrCreateTree = (): ITreeItem => {

    let tree: ITreeItem | undefined;

    let treeStr = sessionStorage.getItem(treeKey);
    if (treeStr === null) {
        const newTree = createTree();
        tree = newTree;
        treeStr = JSON.stringify(tree);
        sessionStorage.setItem(treeKey, treeStr);
    } else {
        tree = JSON.parse(treeStr);
    }

    return tree!;
}

export const bigDataMocks = [

    rest.get<{}, reqs.bigdata.Response_GetData>(routes.bigdata.getdata, (req, res, ctx) => {
        const tree = getOrCreateTree();

        return res(ctx.json({
            tree: tree!
        }));
    }),

    rest.post<reqs.bigdata.Request_GetNode, reqs.bigdata.Response_GetNode>(routes.bigdata.getnode, (req, res, ctx) => {
        const tree = getOrCreateTree();
        const node = TreeService.findItem(req.body.id, [tree]);
        if (node != null) {
            node.children = [];
        }
        return res(ctx.json({
            node
        }));
    }),
]