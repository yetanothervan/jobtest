import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { FC } from "react";
import { Tree } from "../../components/tree/Tree";
import { TreesPage_UiStoreContext } from "./trees.ui.store";

export const CachedTreeView: FC = observer(() => {

    const uistore = useContext(TreesPage_UiStoreContext);

    return (
        <Tree uistore={uistore.cachedDataTree} />
    );

});
