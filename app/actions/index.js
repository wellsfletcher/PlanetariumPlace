import { ADD_ARTICLE, SET_TILE, SET_MOUSE_DOWN, SET_BRUSH_COLOR, TILES_FETCHED } from "../constants/actionTypes";


export function addArticle(payload) {
    return { type: ADD_ARTICLE, payload };
};

export function setTile(payload) {
    return { type: SET_TILE, payload };
};

export function setMouseDown(payload) {
    return { type: SET_MOUSE_DOWN, payload };
};

export function setBrushColor(payload) {
    return { type: SET_BRUSH_COLOR, payload };
};

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
/*
export function getData(dispatch) { // , getState
    alert("bbbbb");
    return fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(json => {
            dispatch({ type: "DATA_LOADED", payload: json });
        }
    );
}
*/

/*
export function fetchTiles() {
    // alert("aaaaa");
    return function(dispatch) { // , getState
        alert("hhhhhhh");
        return fetch("https://planetarium.place/api/v0/board/tiles.php")
            .then(response => response.json())
            .then(json => {
                dispatch({ type: TILES_FETCHED, payload: json });
            }
        );
    };
}
*/


/**
* Handle a single "chunk" or response data.
* This modifies the local timestamp, canvas, and offset variables.
* @function
* @param {Uint8Array} responseArray
*/

export function fetchTiles() {
    // alert("aaaaa");
    return function(dispatch) { // , getState
        // alert("hhhhhhh");

        var timestamp;
        var canvas = new Uint8Array(512 * 256);
        var offset = 0;

        function handleChunk(responseArray) {
            // If we haven't set the timestamp yet, slice it off of this chunk
            if (!timestamp) {
                timestamp = (new Uint32Array(responseArray.buffer, 0, 1))[0],
                responseArray = new Uint8Array(responseArray.buffer, 4);
            }
            // Each byte in the responseArray represents two values in the canvas
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
