import { IAddPending } from "../../models/IAddPending"
import { IRenamePending } from "../../models/IRenamePending"

export type Request_Apply = {
    renamePending: IRenamePending[],
    addPending: IAddPending[],
    deletePending: string[]
}
