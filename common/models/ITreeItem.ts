export interface ITreeItem {    
    caption: string;
    id: string;
    parentId?: string;
    children: ITreeItem[];
    isDeleted: boolean,
    pendingDelete: boolean,
    pendingApply: boolean
}
