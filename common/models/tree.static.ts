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

export const TreeService = {
    findItem
}