import { TILES_FETCHED, TILE_CHANGES_FETCHED } from "../constants/actionTypes";
// import { playChange } from "../actions/index";
import * as Actions from '../actions';
import * as System from '../constants/system';
import { date2str } from "./time";

import { actions } from "../reducers";

export function fetchTerritoryGeojsonFromName(name_long: any): Promise<any> {
    return fetch('https://planetarium.place/api/v0/country/geometryFromName.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name_long: name_long
            })
        }
    )
    .then(res => res.json())
    .then(payload => {
        console.debug(payload);
        return payload;
    });
}

export function fetchTerritoryGeojson(wikidataid: any): Promise<any> {
    return fetch('https://planetarium.place/api/v0/country/geometry.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wikidataid: wikidataid
            })
        }
    )
    .then(res => res.json())
    .then(payload => {
        console.debug(payload);
        return payload;
    });
}

function fetchBoardSize(boardId: number): Promise<any> {
    return fetch('https://planetarium.place/api/v0/board/size.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: boardId
            })
        }
    )
    .then(res => res.json())
    .then(payload => {
        console.debug(payload);
        return payload;
    });
}

export function fetchTilesSlow(boardId: number, dispatch): Promise<any> {
    return fetchBoardSize(boardId)
        .then(payload => fetchTilesGivenSize(boardId, payload.width, payload.height, dispatch));
}

export function fetchTiles(boardId, dispatch) {
    return fetchTilesGivenSize(boardId, System.INITIAL_WIDTH, System.INITIAL_HEIGHT, dispatch);
}

/**
This is a redux action.
*/
export function fetchTilesGivenSize(boardId: number, width: number, height: number, dispatch: any): Promise<any> {
    var canvas = new Uint8Array(width * height);
    var offset = 0;

    function handleChunk(responseArray) {
        // console.log("response array = ");
        // console.log(responseArray);
        console.debug("byteLength = " + responseArray.byteLength);
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
                        // removed during optimization improvements
                        //- console.log(canvas);
                        // return canvas;
                        /*
                        return new Promise((resolve, reject) => {
                            resolve(canvas);
                        });
                        */
                        return dispatch({ type: TILES_FETCHED, payload: {canvas, width} });
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
export function draw(boardId: number, {x, y}, color: number): void { // width?
    console.debug("setting tile...");
    console.debug({ boardId, x, y, color });
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

// // TODO: make this function not exist
// export function fetchTileChangesFixed(lastUpdated: Date, boardId: number, dispatch: any): void {
//     // return fetchTileChanges(boardId, lastUpdated, dispatch);
// }

/**
This is a Redux action.
*/
export function fetchTileChanges(lastUpdated: Date, boardId: number, dispatch: any): void { // width?
    const since = date2str(lastUpdated);
    // const {boardId, since} = dispatch;
    //- console.log("getting history...");
    // console.log({ boardId, since });
        console.debug("params:");
        console.debug(JSON.stringify({
            boardId: boardId,
            since: since
        }));
    // TODO: make this handle failures gracefully, in case the user is temporarily disconnected from the wifi
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
        // console.log("We are in the fetch tile changes promise");
        const unplayedChangesBackingArray = payload;
        console.debug("Did we get any changes?");
        for (var k = 0; k < unplayedChangesBackingArray.length; k++) {
            let change = unplayedChangesBackingArray[k];
            console.debug(change); // this should probably at least day what it is for it to be useful
            console.debug("we got some changes!!!");
            //- dispatch(Actions.playChange( {change} ));
            dispatch(actions.playChange( {change} ));
        }
        return payload;
    })
    .then(payload => {
        // this sets the last updated date... which should really be found based on a time returned by the API
        // otherwise there will be small gaps where tiles may not be fetched
        return { type: TILE_CHANGES_FETCHED, payload: payload };
    })
    .then(action => {
        return dispatch(action);
    });
}
