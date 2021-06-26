import { TILES_FETCHED, TILE_CHANGES_FETCHED } from "../constants/actionTypes";
// import { playChange } from "../actions/index";
import * as Actions from '../actions/index';
import { date2str } from "../utils/time";

/**
This is a redux action.
*/
export function fetchTiles(dispatch) {
    var boardId = 1;
    var canvas = new Uint8Array(1024 * 512);
    var offset = 0;

    function handleChunk(responseArray) {
        console.log("response array = ");
        console.log(responseArray);
        for (var i = 0; i < responseArray.byteLength; i++) {
            canvas[offset + 2 * i] = responseArray[i] >> 4;
            canvas[offset + 2 * i + 1] = responseArray[i] & 15;
        }
        offset += responseArray.byteLength * 2;
    }

    return fetch("https://planetarium.place/api/v0/board/tiles.php", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: boardId
            })
        })
        .then(res => {

            function next(reader) {
                reader.read().then(function(chunk) {
                    if (chunk.done) {
                        console.log(canvas);
                        // return canvas;
                        /*
                        return new Promise((resolve, reject) => {
                            resolve(canvas);
                        });
                        */
                        return dispatch({ type: TILES_FETCHED, payload: canvas });
                    } else {
                        handleChunk(chunk.value);
                        return next(reader);
                    }
                });
            }
            return next(res.body.getReader());

        });
}

/*
@color is colorCode with value from [0–15]
*/
export function draw(boardId, {x, y}, color) { // width?
    console.log("setting tile...");
    console.log({ boardId, x, y, color });
    fetch('https://planetarium.place/api/v0/board/draw.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: boardId,
                x: x,
                y: y,
                color: color
            })
        }
    );
}

/*
export function fetchTileChanges(boardId, lastUpdated, dispatch) { // width?
    const since = date2str(lastUpdated);
    // const {boardId, since} = dispatch;
    console.log("getting history...");
    // console.log({ boardId, since });
    fetch('https://planetarium.place/api/v0/board/history.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: boardId,
                since: since
            })
        }
    )
    .then(res => res.json())
    .then((data) => {
        return dispatch({ type: TILE_CHANGES_FETCHED, payload: data });
    });
}
*/

/**
This is a Redux action.
*/
export function fetchTileChanges(boardId, lastUpdated, dispatch) { // width?
    const since = date2str(lastUpdated);
    // const {boardId, since} = dispatch;
    console.log("getting history...");
    // console.log({ boardId, since });
    fetch('https://planetarium.place/api/v0/board/history.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: boardId,
                since: since
            })
        }
    )
    .then(res => res.json())
    .then(payload => {
        console.log("We are in the fetch tile changes promise");
        const unplayedChangesBackingArray = payload;
        for (var k = 0; k < unplayedChangesBackingArray.length; k++) {
            let change = unplayedChangesBackingArray[k];
            console.log(change);
            dispatch(Actions.playChange( {change} ));
        }
        return payload;
    })
    .then(payload => {
        return { type: TILE_CHANGES_FETCHED, payload: payload };
    })
    .then(action => {
        return dispatch(action);
    });
}
