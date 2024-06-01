import { createStore, applyMiddleware } from "redux";
import { forbiddenWordsMiddleware } from "../middleware";
import thunk from "redux-thunk";

// import rootReducer from "../reducers/index";
import {rootReducer, State} from "../reducers";
// import boardReducer from "../features/board/boardSlice";

// import { } from "../actions/index";


// const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*
const store = createStore(rootReducer);
*/

/*
const store = createStore(
  rootReducer,
  // storeEnhancers(applyMiddleware(forbiddenWordsMiddleware))
  applyMiddleware(forbiddenWordsMiddleware, thunk)
  // applyMiddleware(thunk)
);
*/

import { configureStore } from '@reduxjs/toolkit';

// const stateSanitizer = (state) => {state.board ? { ...state, board: '<<LONG_BLOB>>' } : state};
// TODO: figure out why you can't set the type of this parameter to state
const stateSanitizer = (state: any) => {
    var result: any = state;
    if (state.board) {
        const {tilesRgba, tiles, map, ...includedProps} = state.board;
        const board = {...includedProps, tilesRgba: "{OMITTED}", tiles: "[OMITTED]", map: "[OMITTED]"};
        result = {
            ...state, board: board // '<<LONG_BLOB>>'
        };
    }
    return result;
};

const storeOptions = {
    reducer: rootReducer,
    /*
    reducer: {
        root: rootReducer,
        board: boardReducer
    },
    */
    // middleware: [forbiddenWordsMiddleware, thunk]
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false, immutableCheck: false}).concat(forbiddenWordsMiddleware),
    devTools: {
        stateSanitizer
    }
};

const store = configureStore(storeOptions);

// const store = configureStore({
//     reducer: rootReducer,
//     /*
//     reducer: {
//         root: rootReducer,
//         board: boardReducer
//     },
//     */
//     // middleware: [forbiddenWordsMiddleware, thunk]
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false, immutableCheck: false}).concat(forbiddenWordsMiddleware),
//     devTools: {
//         stateSanitizer
//     }
// });


export default store;
