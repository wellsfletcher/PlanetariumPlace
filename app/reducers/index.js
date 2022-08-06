import { ADD_ARTICLE, SET_TILE, SET_MOUSE_DOWN, SET_BRUSH_COLOR, TILES_FETCHED, TILE_CHANGES_FETCHED } from "../constants/actionTypes";
import * as Action from "../constants/actionTypes";
import * as System from "../constants/system";
import { xy2index } from '../utils/general';
import * as Board from '../modules/board';
import Queue from '../utils/Queue';

import {
  createSlice
} from '@reduxjs/toolkit'

const initBoard = (width, height) => {
    var result = [];
    var index = 0;
    const BACKGROUND_COLOR = 0x1B1B1B;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            // var color = 0;
            var color = BACKGROUND_COLOR;

            if ((1 * (x + y)) % 16 == 0  ^  (1 * (x - y)) % 16 == 0 ) {
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

    const DEADZONE_DEGREE_HEIGHT = 10;
    // const DEADZONE_HEIGHT = 14; // 14 or 13 // 8
    const DEADZONE_HEIGHT = Math.round((height / 180) * DEADZONE_DEGREE_HEIGHT); // optionally round up
    // add the deadzone
    const deadzones = [
        {
            x: {min: 0, max: width},
            y: {min: 0, max: DEADZONE_HEIGHT}
        }, {
            x: {min: 0, max: width},
            y: {min: height - DEADZONE_HEIGHT, max: height}
        }
    ];
    /*
    const deadzones = [
        {
            x: 0,
            y: 0,
            width: width,
            height: DEADZONE_HEIGHT
        }
    ];
    */
    for (var deadzone of deadzones) {
        for (var y = deadzone.y.min; y < deadzone.y.max; y++) {
            for (var x = deadzone.x.min; x < deadzone.x.max; x++) {
                const index = xy2index(x, y, width);
                /*
                var yBorder = 0;
                if (Math.abs((width / 2) - deadzone.y.min) < Math.abs((width / 2) - deadzone.y.max)) {
                    yBorder = deadzone.y.min; // + Math.sign(Math.abs((width / 2) - deadzone.y.min));
                    // console.log("aaaaaa");
                } else {
                    yBorder = deadzone.y.max; // + Math.sign(Math.abs((width / 2) - deadzone.y.max));
                }
                var color = result[xy2index(x, yBorder, width)]
                */
                var color = BACKGROUND_COLOR;
                result[index] = color; // 0; // BACKGROUND_COLOR;
                // console.log(index);
            }
        }
    }

    return result;
};

/*
const initMap = () => {
    var result = new Map();

    result.set(5, 1);

    return result;
};
*/

const initMap = (width, height) => { // technically should be an array of lists of boardIds
    var result = [];
    var index = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var value = 0;

            if ((1 * (x + y)) % 16 == 0  ^  (1 * (x - y)) % 16 == 0 ) {
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

const initialState = {
    articles: [], // remove this
    mouseDown: false, // not used
    boardId: System.INITIAL_BOARD_ID,
    // remoteTiles: null,
    board: {
        lastUpdated: new Date(),
        // unplayedChanges: [],
        unplayedChanges: new Queue(), // not used

        tilesRgba: new Uint8ClampedArray(new ArrayBuffer(System.INITIAL_WIDTH * System.INITIAL_HEIGHT * 4)),
        tiles: initBoard(System.INITIAL_WIDTH, System.INITIAL_HEIGHT),
        // links: initLinks, // maps pixel to relative url string
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
        /*
        addArticle(state, action) {
            return { ...state, articles: state.articles.concat(action.payload) };
        },
        */
        tilesFetched(state, action) {
            state = {  ...state, board: {...state.board, width: action.payload.width} };
            return Board.setTiles(state, action.payload.canvas);
        },
        tileChangesFetched(state, action) {
            const board = {
                ...state.board,
                lastUpdated: new Date(),
                unplayedChanges: state.board.unplayedChanges.concat(action.payload)
            };

            return {  ...state, board: board };
        },
        setMouseDown(state, action) {
            return { ...state, mouseDown: action.payload };
        },
        setActiveCountry(state, action) {
            return { ...state, board: {...state.board, activeCountry: action.payload} };
        },
        setBrushColor(state, action) {
            return { ...state, brushColor: action.payload };
        },
        setLocalTile(state, action) {
            const index = action.payload.index;
            const width = state.board.width;
            const color = action.payload.color;

            return Board.setTileLocally(state, index, width, color);
        },
        setTile(state, action) {
            const {x, y} = action.payload;
            const width = state.board.width;
            const color = action.payload.color;

            return Board.setTile(state, {x, y}, width, color);
        },
        playChange(state, action) {
            const change = action.payload.change;
            const index = change.index;
            const width = state.board.width;
            const color = change.color;

            return Board.setTileLocally(state, index, width, color);
        },
        setBoardId(state, action) {
            return { ...state, boardId: action.payload };
        }
    }
});

export const actions = rootSlice.actions;
export const rootReducer = rootSlice.reducer;

// export default rootSlice.reducer;
// export default rootReducer;
