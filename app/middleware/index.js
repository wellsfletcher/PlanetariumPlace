import { ADD_ARTICLE, SET_TILE } from "../constants/actionTypes";
import * as Action from "../constants/actionTypes";
import * as System from '../constants/system';

import { mod } from '../utils/general';
import * as Time from '../utils/time';


const forbiddenWords = ["spam", "money"];

export function forbiddenWordsMiddleware({ getState, dispatch }) { // { getState, dispatch }
    return function(next) {
        return function(action) {
            // do your stuff
            if (action.type === ADD_ARTICLE) {
                const title = action.payload.title;
                const foundWord = forbiddenWords.filter(word =>
                    title.includes(word)
                );

                if (foundWord.length || title === "") {
                    return dispatch({ type: "FOUND_BAD_WORD" });
                }
            } else if (action.type === SET_TILE) {
                var {x, y} = action.payload;
                const state = getState();
                // console.log(state.board);
                const tiles = state.board.tiles;
                const index = (action.payload.y * state.board.width) + action.payload.x;
                if (mod(index, tiles.length) != index) {
                    alert("TILE_OUT_OF_BOUNDS: " + x + ", " + y + " is invalid.");
                    return dispatch({ type: "TILE_OUT_OF_BOUNDS" });
                }
            } else if (action.type === Action.PLAY_CHANGE) {
                // console.log("Going through play_change middleware");
                const change = action.payload.change;
                // console.log("change = ");
                // console.log(change);
                const TILE_UPDATE_OFFSET = System.TILE_UPDATE_OFFSET;
                const changeDelay = Time.getRemaining(Time.addMillis(Time.str2date(change.timestamp), TILE_UPDATE_OFFSET));
                setTimeout(() => {
                    // Delay this action by one second
                    next(action);
                }, changeDelay);
                return; // I hope

            }
            return next(action);
        };
    };
}

/*
const delayedActionMiddleware = storeAPI => next => action => {
    if (action.type === 'todos/todoAdded') {
        setTimeout(() => {
            // Delay this action by one second
            next(action)
        }, 1000)
        return
    }

    return next(action)
}
*/
