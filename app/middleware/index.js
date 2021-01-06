import { ADD_ARTICLE, SET_TILE } from "../constants/actionTypes";

import { mod } from '../utils/general';


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
                const tiles = state.board.tiles;
                const index = (action.payload.y * state.board.width) + action.payload.x;
                if (mod(index, tiles.length) != index) {
                    alert("TILE_OUT_OF_BOUNDS: " + x + ", " + y + " is invalid.");
                    return dispatch({ type: "TILE_OUT_OF_BOUNDS" });
                }
            }
            return next(action);
        };
    };
}
