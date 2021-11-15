import { Box, Button } from "@material-ui/core";
import React, { FC, useContext } from "react";
import { TreesPage_UiStoreContext } from "./trees.ui.store";

export const CachePanel: FC = () => {

    const uistore = useContext(TreesPage_UiStoreContext);

    return (
        <Box display="flex" style={{ width: '100%', justifyContent: 'flex-end', gap: '8px' }} >
            <Button variant="contained" color="primary"
                onClick={() => uistore.apply()}>Применить</Button>
            <Button variant="contained" color="secondary"
                onClick={() => uistore.reset()}>Сбросить</Button>
        </Box>
    );
}

export default CachePanel