import { SET_TILE } from "../constants/actionTypes";
import * as Action from "../constants/actionTypes";
import * as System from '../constants/system';

import { mod } from '../utils/general';
import * as Time from '../utils/time';
import {BaseState} from "../reducers";
import {AppDispatch, RootState} from "../store";
import {getTotalPixelsFromTilesRgba} from "../modules/board";

interface MiddlewareInput {
    getState: () => RootState,
    dispatch: AppDispatch
}

export function forbiddenWordsMiddleware({ getState, dispatch }: MiddlewareInput) { // { getState, dispatch }
    return function(next) {
        return function(action) {
            if (action.type === SET_TILE) { // this should be changed
                var {x, y} = action.payload;
                const state: BaseState = getState();
                // console.log(state.board);
                // removing Tiles array to improve performance
                const tilesRgba = state.board.tilesRgba;
                const index = (action.payload.y * state.board.width) + action.payload.x;
                if (mod(index, getTotalPixelsFromTilesRgba(tilesRgba)) != index) {
                    alert("TILE_OUT_OF_BOUNDS: " + x + ", " + y + " is invalid.");
                    return dispatch({ type: "TILE_OUT_OF_BOUNDS" });
                }
            } else if (action.type === Action.PLAY_CHANGE) {
                if (System.SHOULD_BULK_UPDATE_TILES == true) {
                    next(action);
                }
                // console.log("Going through play_change middleware");
                const change = action.payload.change;
                // console.log("change = ");
                // console.log(change);
                const TILE_UPDATE_OFFSET = System.TILE_UPDATE_OFFSET;
                const changeTimestamp: Date = Time.str2date(change.timestamp);
                const timestampToPlayChange = Time.addMillis(changeTimestamp, TILE_UPDATE_OFFSET); // shouldn't this equal TILE_UPDATE_FREQUENCY?
                // refactored bc TS error
                // const changeDelay = Time.getRemaining(Time.addMillis(Time.str2date(change.timestamp), TILE_UPDATE_OFFSET));
                const changeDelay = Time.getRemaining(timestampToPlayChange.getTime());
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
