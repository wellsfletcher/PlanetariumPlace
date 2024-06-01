import { createStore, applyMiddleware } from "redux";
import { forbiddenWordsMiddleware } from "../middleware";
import thunk from "redux-thunk";

// import rootReducer from "../reducers/index";
import { rootReducer } from "../reducers";
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
const stateSanitizer = (state) => {
    var result = state;
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
console.log("storeOptions = ");
console.log(storeOptions);
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
