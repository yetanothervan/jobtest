import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { FC } from "react";
import { InputStringDlg } from "../../components/dialog/InputStringDlg";
import { Tree } from "../../components/tree/Tree";
import { TreesPage_UiStoreContext } from "./trees.ui.store";

export const CachedTreeView: FC = observer(() => {

    const uistore = useContext(TreesPage_UiStoreContext).cachedDataTree;

    //=== handlers

    const handleInputDlgCancel = () => uistore.cancelRenaming();
    const handleInputDlgSet = (value: string | undefined) => {
        if (uistore.renameDlg.id && value) {
            uistore.renameItem(uistore.renameDlg.id, value);
        } else {
            uistore.cancelRenaming();
        }
    };

    return (
        <>
            <Tree uistore={uistore.myTreeView} />
            <InputStringDlg onCancel={handleInputDlgCancel}
                onSet={handleInputDlgSet}
                visible={uistore.renameDlg.visible}
                title='Введите новое значение'
                value={uistore.renameDlg.oldName}
            ></InputStringDlg>
        </>
    );

});
