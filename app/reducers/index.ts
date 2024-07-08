import { SET_TILE, SET_MOUSE_DOWN, SET_BRUSH_COLOR, TILES_FETCHED, TILE_CHANGES_FETCHED } from "../constants/actionTypes";
import * as Action from "../constants/actionTypes";
import * as System from "../constants/system";
import {XOR, xy2index} from '../utils/general';
import * as Board from '../modules/board';
import Queue from '../utils/Queue';

import {
  createSlice
} from '@reduxjs/toolkit'
import {RootState} from "../store";

const initBoard = (width: number, height: number): number[] => {
    // instead of making the board initially all black, we make it in a checkerboard pattern for debugging purposes
    var result = [];
    var index = 0;
    const BACKGROUND_COLOR = 0x1B1B1B;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            // var color = 0;
            var color = BACKGROUND_COLOR;

            // changed because of TS error
            // if ((1 * (x + y)) % 16 == 0  ^  (1 * (x - y)) % 16 == 0 ) {
            if (XOR((1 * (x + y)) % 16 == 0, (1 * (x - y)) % 16 == 0)) {
                // color = 1;
                // color = 1752220;
                color = 0xCF6EE4;
                if (x < width / 2) {
                    color = 0x02BE01;
                    if (y < height / 2) {
                        color = 0x0083C7;
                    }
                } else {
                    if (y < height / 2) {
                        color = 0xE5D900;
                    }
                }
            }

            result.push(color);

            index++;
        }
    }

    return result;
};

const initMap = (width: number, height: number): number[] => { // technically should be an array of lists of boardIds
    var result = [];
    var index = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var value = 0;

            // changed because of TS error
            // if ((1 * (x + y)) % 16 == 0  ^  (1 * (x - y)) % 16 == 0 ) {
            if (XOR((1 * (x + y)) % 16 == 0, (1 * (x - y)) % 16 == 0)) {
                if ((1 * (x + y)) % 16 == 0) {
                    value = 1;
                } else {
                    value = 2;
                }
            }

            result.push(value);

            index++;
        }
    }
    return result;
};

// as of now, the code can run fine with some pretty crazy high resolutions,
// but the server would probably explode

export interface BaseState {
    articles: any[],
    mouseDown: boolean,
    boardId: number,
    board: BoardState,
    brushColor: number,
}

export interface BoardState {
    lastUpdated: Date,
    //- unplayedChanges: typeof Queue, // TODO: investigate why typeof is needed here
    tilesRgba: Uint8ClampedArray,
    // removing Tiles array to improve performance
    // tiles: number[],
    map: number[],
    values: string[],
    activeCountry: string,
    width: number,
}

const initialState: BaseState = {
    articles: [], // remove this
    mouseDown: false, // not used
    boardId: System.INITIAL_BOARD_ID,
    // remoteTiles: null,
    board: {
        lastUpdated: new Date(),
        // unplayedChanges: [],
        //- unplayedChanges: new Queue(), // not used

        tilesRgba: new Uint8ClampedArray(new ArrayBuffer(System.INITIAL_WIDTH * System.INITIAL_HEIGHT * 4)),
        // removing Tiles array to improve performance
        // tiles: initBoard(System.INITIAL_WIDTH, System.INITIAL_HEIGHT),
        // links: initLinks, // maps pixel to relative url string
        // TODO: investigate if I can finally remove this
        map: initMap(System.INITIAL_WIDTH, System.INITIAL_HEIGHT), // new Map(), // initMap(), // not used anymore I think
        values: ["", "canada", "usa", "mexico", "brazil"], // features // also not used
        activeCountry: "",
        width: System.INITIAL_WIDTH
    },
    brushColor: System.INITIAL_BRUSH_COLOR
};

const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {
        tilesFetched(state: BaseState, action) {
            state = {  ...state, board: {...state.board, width: action.payload.width} };
            return Board.setTiles(state, action.payload.canvas);
        },
        tileChangesFetched(state: BaseState, action) {
            const board = {
                ...state.board,
                lastUpdated: new Date(),
                // removed bc of TS error
                //- unplayedChanges: state.board.unplayedChanges.concat(action.payload)
            };

            return {  ...state, board: board };
        },
        setMouseDown(state: BaseState, action) {
            return { ...state, mouseDown: action.payload };
        },
        setActiveCountry(state: BaseState, action) {
            // extra logic to allow toggle behavior
            // TODO: maybe just move this to the CountryCard actually so like the CountryCard also shows if that country is active or not
            let nextCountry = action.payload;
            // if (state.board.activeCountry == action.payload) {
            //     nextCountry = "";
            // }
            return { ...state, board: {...state.board, activeCountry: nextCountry} };
        },
        setBrushColor(state: BaseState, action) {
            return { ...state, brushColor: action.payload };
        },
        setLocalTile(state: BaseState, action) {
            const index = action.payload.index;
            const width = state.board.width;
            const color = action.payload.color;

            return Board.setTileLocally(state, index, width, color);
        },
        setTile(state: BaseState, action) {
            const {x, y} = action.payload;
            const width = state.board.width;
            const color = action.payload.color;

            return Board.setTile(state, {x, y}, width, color);
        },
        playChange(state: BaseState, action) {
            const change = action.payload.change;
            const index = change.index;
            const width = state.board.width;
            const color = change.color;

            return Board.setTileLocally(state, index, width, color);
        },
        setBoardId(state: BaseState, action) {
            return { ...state, boardId: action.payload };
        }
    }
});

// console.log("rootSlice.reducer = ");
// console.log(rootSlice.reducer);

export const actions = rootSlice.actions;
export const rootReducer = rootSlice.reducer;

// export default rootSlice.reducer;
// export default rootReducer;
