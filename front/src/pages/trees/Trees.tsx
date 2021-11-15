import { createStyles, makeStyles } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { FC } from "react";
import { RootStoreContext } from "../../store";
import { DBTreeView } from "./DBTreeView";
import { CachedTreeView } from "./CachedTreeView";
import { TreesPages_UiStore, TreesPage_UiStoreContext } from "./trees.ui.store";
import CachePanel from "./CachePanel";

const useStyles = makeStyles((theme) =>
    createStyles({
        whole100vh: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            maxHeight: '100vh',
            backgroundColor: theme.palette.grey[200]
        },
        container: {
            flexGrow: 1,
            maxWidth: '1024px',
            display: 'flex',
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2)
        },

        // {{ left side
        leftSide: {
            flexGrow: 1,            
            display: 'flex',
            flexDirection: 'column'            
        },
        leftTree: {
            flexGrow: 1,
            overflow: 'auto',
            backgroundColor: theme.palette.common.white
        },
        leftPanel: {
            margin: theme.spacing(1)
        },
        // }} left side

        rightSide: {
            flexGrow: 1,
            backgroundColor: theme.palette.common.white,
            overflow: 'auto'
        },

        gap: {
            width: theme.spacing(2)
        }
    })
);

export const Trees: FC = observer(() => {

    const cl = useStyles();

    const rootStore = useContext(RootStoreContext);

    const uistore = new TreesPages_UiStore(rootStore);

    return (
        <TreesPage_UiStoreContext.Provider value={uistore}>
            <div className={cl.whole100vh}>
                <div className={cl.container}>

                    <div className={cl.leftSide}>
                        <div className={cl.leftTree}>
                            <CachedTreeView />
                        </div>
                        <div className={cl.leftPanel}>
                            <CachePanel />
                        </div>
                    </div>

                    <div className={cl.gap} />

                    <div className={cl.rightSide}>
                        <DBTreeView />
                    </div>

                </div>
            </div>
        </TreesPage_UiStoreContext.Provider >
    );
});
