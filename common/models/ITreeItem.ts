export interface ITreeItem {
    isFolder: boolean;
    caption: string;
    id: string;
    parentId?: string;
    children: ITreeItem[];
}
