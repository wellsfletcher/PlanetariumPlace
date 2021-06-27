import { ADD_ARTICLE, SET_TILE, SET_MOUSE_DOWN, SET_BRUSH_COLOR, TILES_FETCHED } from "../constants/actionTypes";
import * as Action from "../constants/actionTypes";
import * as System from '../constants/system';
import * as API from "../utils/api";
import store from "../store/index";


export function addArticle(payload) {
    return { type: ADD_ARTICLE, payload };
};

export function setTile(payload) {
    return { type: SET_TILE, payload };
};

export function setLocalTile(payload) {
    return { type: Action.SET_LOCAL_TILE, payload };
};

export function playChange(payload) {
    return { type: Action.PLAY_CHANGE, payload };
};

export function setMouseDown(payload) {
    return { type: SET_MOUSE_DOWN, payload };
};

export function setBrushColor(payload) {
    return { type: SET_BRUSH_COLOR, payload };
};

/*
export function fetchTileChanges(payload) {
    return { type: Action.TILE_CHANGES_FETCHED, payload };
};
*/

export function getData() {
    // alert("aaaaa");
    return function(dispatch) { // , getState
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
    return function(dispatch, getState) { // , getState
        // const canvas = API.fetchTiles();
        // return dispatch({ type: TILES_FETCHED, payload: API.fetchTiles() });
        /*
        return API.fetchTiles().then((canvas) => {
            console.log("resolved!");
            console.log(canvas);
            return dispatch({ type: TILES_FETCHED, payload: canvas });
        });
        */
        const state = store.getState();
        const boardId = state.boardId;
        return API.fetchTiles(boardId, dispatch);
    }
}

export function fetchTiles2() { // I don't think this is used
    // alert("aaaaa");
    return function(dispatch) { // , getState
        // alert("hhhhhhh");

        var timestamp;
        var canvas = new Uint8Array(1024 * 512);
        var offset = 0;

        function handleChunk(responseArray) {
            // If we haven't set the timestamp yet, slice it off of this chunk
            /*
            if (!timestamp) {
                timestamp = (new Uint32Array(responseArray.buffer, 0, 1))[0],
                responseArray = new Uint8Array(responseArray.buffer, 4);
            }
            */
            /*
            // Each byte in the responseArray represents two values in the canvas
            for (var i = 0; i < responseArray.byteLength; i++) {
                canvas[offset + 2 * i] = responseArray[i] >> 4;
                canvas[offset + 2 * i + 1] = responseArray[i] & 15;
            }
            offset += responseArray.byteLength * 2;
            */
            console.log("response array = ");
            console.log(responseArray);
            for (var i = 0; i < responseArray.byteLength; i++) {
                canvas[offset + 2 * i] = responseArray[i] >> 4;
                canvas[offset + 2 * i + 1] = responseArray[i] & 15;
            }
            offset += responseArray.byteLength * 2;
        }

        return fetch("https://planetarium.place/api/v0/board/tiles.php")
            .then(res => {


                /*
                function next(reader) {
                    reader.read().then(function(chunk) {
                        if (chunk.done) {
                            dfd.resolve(timestamp, canvas);
                        } else {
                            handleChunk(chunk.value);
                            next(reader);
                        }
                    });
                }
                next(res.body.getReader());
                */
                // console.log(res);
                // console.log(res.body.getReader());


                function next(reader) {
                    reader.read().then(function(chunk) {
                        if (chunk.done) {
                            console.log(canvas);
                            // return Promise.resolve(canvas);
                            return dispatch({ type: TILES_FETCHED, payload: canvas });
                        } else {
                            handleChunk(chunk.value);
                            return next(reader);
                        }
                    });
                }
                return next(res.body.getReader());

                // return res;

            });
            /*
            .then(json => {
                dispatch({ type: TILES_FETCHED, payload: json });
            });
            */
    };
}

export function fetchTileChanges() {
    // alert("aaaaa");
    return function(lastUpdated, boardId, dispatch) { // , getState
        // const canvas = API.fetchTiles();
        // return dispatch({ type: TILES_FETCHED, payload: API.fetchTiles() });
        /*
        return API.fetchTiles().then((canvas) => {
            console.log("resolved!");
            console.log(canvas);
            return dispatch({ type: TILES_FETCHED, payload: canvas });
        });
        */
        return API.fetchTileChanges(lastUpdated, boardId, dispatch);
    }
}
