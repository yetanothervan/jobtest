import { observer } from 'mobx-react-lite';
import React, { FC, useContext } from 'react';
import { Tree } from '../../components/tree/Tree';
import { TreesPage_UiStoreContext } from './trees.ui.store';

export const DBTreeView: FC = observer(() => {

    const uistore = useContext(TreesPage_UiStoreContext);

    return (
        <Tree uistore={uistore.bigDataTree.myTreeView} />
    );
});
