import React, { FC } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { ITreeItem } from '../../../../common/models/ITreeItem';
import { ITree_UiStore } from './tree.ui.store';
import { observer } from 'mobx-react-lite';
import { Menu, MenuItem, Typography } from '@material-ui/core';

type ContextMenuFun = (event: React.MouseEvent, caption: string, nodeId: string) => void;

export const Tree: FC<{ uistore: ITree_UiStore }> = observer(({ uistore }) => {

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
        caption: string;
        nodeId: string;
    } | null>(null);

    // === handlers 

    const handleContextMenu: ContextMenuFun = (e, caption, nodeId) => {
        e.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: e.clientX - 2,
                    mouseY: e.clientY - 4,
                    caption,
                    nodeId
                }
                : null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const toggleExpandedHandler = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
        uistore.setExpanded(nodeIds);
    };

    // render

    if (uistore.data === undefined) {
        return (<p>
            Нет данных
        </p>);
    }

    const nodes = uistore.data.map(i => recursiveTree(i, handleContextMenu));

    return (
        <div style={{ width: '100%' }}>
            <TreeView style={{ width: '100%' }}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={uistore.expanded}
                onNodeToggle={toggleExpandedHandler}
            >
                {nodes}
            </TreeView>

            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem disabled>{contextMenu?.caption}</MenuItem>
                {contextMenu?.nodeId && uistore.getContextMenu && uistore.getContextMenu(contextMenu.nodeId)?.map(m => (
                    <MenuItem key={m.caption} disabled={m.disabled} onClick={() => { m.onClick(); handleClose(); }}>{m.caption}</MenuItem>
                ))}
            </Menu>
        </div>
    );
});


const recursiveTree = (node: ITreeItem, onContextMenu: ContextMenuFun) => {

    const handlerContext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, node.caption, node.id);
    }
    return (
        <TreeItem onContextMenu={handlerContext} key={node.id} nodeId={node.id}
            label={
                node.isDeleted
                    ? <Typography style={{ color: 'red' }}>{node.caption}</Typography>
                    : <Typography style={{ color: 'black' }}>{node.caption}</Typography>
            }>
            {node.children.map((node: ITreeItem) => recursiveTree(node, onContextMenu))}
        </TreeItem >
    );
};
