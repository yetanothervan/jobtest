import { ITreeItem } from "./ITreeItem";

const findItem = (id: string, items: ITreeItem[]): ITreeItem | null => {
    const recursive = (id: string, item: ITreeItem): ITreeItem | null => {
        if (item.id === id) return item;
        if (item.children === undefined) {
            return null;
        }
        for (let ch of item.children) {
            const ret = recursive(id, ch);
            if (ret !== null) return ret;
        }
        return null;
    }

    for (let ch of items) {
        const ret = recursive(id, ch);
        if (ret !== null) return ret;
    }
    return null;
}

const findParent = (id: string, items: ITreeItem[]): ITreeItem | null => {
    const recursive = (id: string, item: ITreeItem): ITreeItem | null => {
        if (item.id === id) return null;
        if (item.children === undefined) {
            return null;
        }
        for (let ch of item.children) {
            if (ch.id === id) return item;
            const ret = recursive(id, ch);
            if (ret !== null) return ret;
        }
        return null;
    }

    for (let ch of items) {
        const ret = recursive(id, ch);
        if (ret !== null) return ret;
    }
    return null;
}

const applyToAll = (items: ITreeItem[], applyFunc: (parent: ITreeItem | undefined, node: ITreeItem) => void): void => {
    const recursive = (items: ITreeItem[], parent: ITreeItem, applyFunc: (parent: ITreeItem | undefined, node: ITreeItem) => void): void => {
        for (let ch of items) {
            applyFunc(parent, ch);
            recursive(ch.children, ch, applyFunc);
        }
    }
    for (let ch of items) {
        applyFunc(undefined, ch);
        recursive(ch.children, ch, applyFunc);
    }
}

export const TreeService = {
    findItem,
    findParent,
    applyToAll
}