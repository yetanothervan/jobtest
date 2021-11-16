import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { FC } from "react";
import { InputStringDlg } from "../../../components/dialog/InputStringDlg";
import { Tree } from "../../../components/tree/Tree";
import { TreesPage_UiStoreContext } from "../trees.ui.store";

export const CachedTreeView: FC = observer(() => {

    const uistore = useContext(TreesPage_UiStoreContext).cachedDataTree;

    //=== handlers

    const handleRenameDlgCancel = () => uistore.cancelRenaming();
    const handleRenameDlgSet = (value: string | undefined) => {
        if (uistore.renameDlg.id && value) {
            uistore.renameItem(uistore.renameDlg.id, value);
        } else {
            uistore.cancelRenaming();
        }
    };

    const handleAddNodeDlgCancel = () => uistore.cancelAdding();
    const handleAddNodeDlgSet = (value: string | undefined) => {
        if (uistore.addNodeDlg.parentId && value) {
            uistore.addNode(uistore.addNodeDlg.parentId, value);
        } else {
            uistore.cancelAdding();
        }
    };

    return (
        <>
            <Tree uistore={uistore.myTreeView} />
            <InputStringDlg onCancel={handleRenameDlgCancel}
                onSet={handleRenameDlgSet}
                visible={uistore.renameDlg.visible}
                title='Введите новое значение'
                value={uistore.renameDlg.oldName}
            ></InputStringDlg>
            <InputStringDlg onCancel={handleAddNodeDlgCancel}
                onSet={handleAddNodeDlgSet}
                visible={uistore.addNodeDlg.visible}
                title='Введите значение'
                value={uistore.addNodeDlg.caption}
            ></InputStringDlg>
        </>
    );

});
