import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import { Provider } from "react-redux";
import store from "./store";

// TODO: find a better way of doing this
if (process.env.NODE_ENV === 'production') {
    console.debug = () => {};
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
