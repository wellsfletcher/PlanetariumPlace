import { createStore, applyMiddleware } from "redux";
import { forbiddenWordsMiddleware } from "../middleware";

import rootReducer from "../reducers/index";


// const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*
const store = createStore(rootReducer);
*/

const store = createStore(
  rootReducer,
  // storeEnhancers(applyMiddleware(forbiddenWordsMiddleware))
  applyMiddleware(forbiddenWordsMiddleware)
);

export default store;
