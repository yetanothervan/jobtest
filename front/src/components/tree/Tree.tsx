import React, { FC, useEffect, useRef, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { ITreeItem } from '../../../../common/models/ITreeItem';
import { ITree_UiStore } from './tree.ui.store';
import { observer } from 'mobx-react-lite';

export const Tree: FC<{ uistore: ITree_UiStore }> = observer(({ uistore }) => {

    const templateRef = useRef<JSX.Element[] | null>(null);

    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        if (uistore.data === undefined) {
            templateRef.current = null;
        } else {
            templateRef.current = uistore.data.map(i => recursiveTree(i));
            setRerender(!rerender);
        }
    }, [uistore.data])

    // === handlers 

    const toggleExpandedHandler = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
        uistore.setExpanded(nodeIds);
    };


    if (uistore.data === undefined) {
        return (<p>
            NO DATA
        </p>);
    }

    return (
        <>
            <TreeView
                style={{ width: '100%' }}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={uistore.expanded}
                onNodeToggle={toggleExpandedHandler}
            >
                {templateRef.current}
            </TreeView>
        </>
    );
});


const recursiveTree = (node: ITreeItem) => (
    <TreeItem key={node.id} nodeId={node.id} label={node.caption}>
        {node.isFolder ? node.children.map((node: ITreeItem) => recursiveTree(node)) : null}
    </TreeItem >
);
