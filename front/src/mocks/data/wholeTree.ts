import { v4 } from "uuid";
import { ITreeItem } from "../../../../common/models/ITreeItem";

const newFolder = (caption: string, parentId?: string): ITreeItem => {
    return {        
        caption,
        id: v4(),
        parentId,
        children: [],
        isDeleted: false
    };
}

const newItem = (caption: string, parentId: string): ITreeItem => {
    return {        
        caption,
        id: v4(),
        parentId,
        children: [],
        isDeleted: false
    }
}

const fillWithChildren = (parent: ITreeItem, nestLevel: number, itemsCount: number) => {

    if (nestLevel === 0) {
        parent.children = [...Array(itemsCount).keys()].map(k => newItem(`item ${k + 1}`, parent.id))
        return;
    }

    for (let i = 0; i < itemsCount; ++i) {
        const folder = newFolder(`${parent.caption}.${i + 1}`, parent.id);
        fillWithChildren(folder, nestLevel - 1, 3);
        parent.children.push(folder);
    }

}

export const createTree = (): ITreeItem => {

    const root = newFolder('Root');

    for (let i = 0; i < 5; ++i) {
        const folder = newFolder(`Folder ${i + 1}`, root.id);
        fillWithChildren(folder, 4, 3);
        root.children.push(folder);
    }

    return root;
}