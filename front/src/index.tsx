import React from 'react';
import ReactDOM from 'react-dom';

const render = () => {
    const App = require('./App').default;

    let elem = document.getElementById("root");

    ReactDOM.render(<App />, elem);
};

render();