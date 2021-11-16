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

    rest.get<{}, reqs.bigdata.Response_Reset>(routes.bigdata.reset, (req, res, ctx) => {
        sessionStorage.clear();
        return res();
    }),

    rest.post<reqs.bigdata.Request_Apply>(routes.bigdata.apply, (req, res, ctx) => {
        const tree = getOrCreateTree();

        // apply adding
        const toAdd = req.body.addPending;
        for (const add of toAdd) {
            const node = TreeService.findItem(add.id, [tree]);
            if (node != null) {
                // already exist o_0                
            } else {
                const parent = TreeService.findItem(add.parentId, [tree]);
                if (parent !== null) {
                    parent.children.push({
                        caption: add.caption,
                        id: add.id,
                        parentId: add.parentId,
                        isDeleted: false,
                        children: [],
                        pendingApply: false,
                        pendingDelete: false
                    })
                }
            }
        }

        // apply rename
        const toRename = req.body.renamePending;
        for (const ren of toRename) {
            const node = TreeService.findItem(ren.id, [tree]);
            if (node != null) {
                node.caption = ren.newCaption;
            }
        }

        // apply delete
        const toDelete = req.body.deletePending;
        for (const del of toDelete) {
            const node = TreeService.findItem(del, [tree]);
            if (node != null) {
                node.isDeleted = true;

                TreeService.applyToAll([tree], (parent, item) => {
                    if (item.isDeleted) {
                        return;
                    }
                    if (parent?.isDeleted) {
                        item.isDeleted = true;                        
                        return;
                    }
                });

            }
        }

        // check if added elements are deleted
        for (const add of toAdd) {
            const parent = TreeService.findParent(add.id, [tree]);
            const node = TreeService.findItem(add.id, [tree]);
            if (parent != null && node != null && parent.isDeleted) {
                node.isDeleted = true;                
            }
        }


        // save tree
        const treeStr = JSON.stringify(tree);
        sessionStorage.setItem(treeKey, treeStr);

        return res(ctx.json({
        }));
    }),
]