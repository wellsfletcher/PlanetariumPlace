import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import App from './components/App';

import { Provider } from "react-redux";
import store from "./store";

// TODO: find a better way of doing this
if (process.env.NODE_ENV === 'production') {
    console.debug = () => {};
}

const root = createRoot(document.getElementById("app"));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
