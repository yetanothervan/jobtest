import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Shell } from './pages/shell/Shell';
import { RootStore, RootStoreContext } from './store';

if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mocks/browser');
    worker.start();
}

const App: FC = () => {
    const root = new RootStore();

    useEffect(() => {
        root.bigData.reloadData();
    }, []);

    return (
        <RootStoreContext.Provider value={root}>
            <Shell />
        </RootStoreContext.Provider>
    );
}

export default App;