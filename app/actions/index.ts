import { SET_TILE, SET_MOUSE_DOWN, SET_BRUSH_COLOR, TILES_FETCHED } from "../constants/actionTypes";
import * as Action from "../constants/actionTypes";
import * as System from '../constants/system';
import * as API from "../utils/api";
import store, {AppDispatch} from "../store";
import {BaseState} from "../reducers";


// remove?
export function getData() {
    // alert("aaaaa");
    return function(dispatch: AppDispatch) { // , getState
        // alert("bbbbb");
        return fetch("https://jsonplaceholder.typicode.com/posts")
            .then(response => response.json())
            .then(json => {
                dispatch({ type: "DATA_LOADED", payload: json });
            }
        );
    };
}

/**
* Handle a single "chunk" or response data.
* This modifies the local timestamp, canvas, and offset variables.
* @function
* @param {Uint8Array} responseArray
*/

export function fetchTiles() {
    // alert("aaaaa");
    return function(dispatch: AppDispatch, getState?) { // , getState
        // const canvas = API.fetchTiles();
        // return dispatch({ type: TILES_FETCHED, payload: API.fetchTiles() });
        /*
        return API.fetchTiles().then((canvas) => {
            console.log("resolved!");
            console.log(canvas);
            return dispatch({ type: TILES_FETCHED, payload: canvas });
        });
        */
        const state: BaseState = store.getState();
        const boardId = state.boardId;
        return API.fetchTiles(boardId, dispatch);
    }
}

export function fetchTileChanges() {
    // alert("aaaaa");
    return function(lastUpdated: Date, boardId: number, dispatch: AppDispatch) { // , getState
        // TODO: access the state here in order to avoid unnecessary rerenders every 5 secs
        // const canvas = API.fetchTiles();
        // return dispatch({ type: TILES_FETCHED, payload: API.fetchTiles() });
        /*
        return API.fetchTiles().then((canvas) => {
            console.log("resolved!");
            console.log(canvas);
            return dispatch({ type: TILES_FETCHED, payload: canvas });
        });
        */
        const state: BaseState = store.getState();
        lastUpdated = state.board.lastUpdated;
        return API.fetchTileChanges(lastUpdated, boardId, dispatch);
        // return API.fetchTileChangesFixed(lastUpdated, boardId, dispatch);
        // return API.fetchTileChanges(lastUpdated, boardId, dispatch);
    }
}
