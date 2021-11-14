import { ITreeItem } from "../../models/ITreeItem"

export type Request_GetNode = {
    id: string
}

export type Response_GetNode = {
    node: ITreeItem | null
}