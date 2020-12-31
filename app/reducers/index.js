import { ADD_ARTICLE, SET_TILE, SET_MOUSE_DOWN, SET_BRUSH_COLOR } from "../constants/actionTypes";
// import { hexcolor2int } from '../utils/general';


const initBoard = (width, height) => {
    var result = [];
    var index = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            // var color = 0;
            var color = 0x1B1B1B;

            if ((1 * (x + y)) % 16 == 0  ^  (1 * (x - y)) % 16 == 0 ) {
                // color = 1;
                // color = 1752220;
                color = 0xCF6EE4;
            }

            result.push(color);

            index++;
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

const INITIAL_WIDTH = 512;
const INITIAL_HEIGHT = 420;
const INITIAL_BRUSH_COLOR = 1752220;

const initialState = {
    articles: [],
    mouseDown: false,
    boardId: 1,
    board: {
        // tiles: [],
        tiles: initBoard(INITIAL_WIDTH, INITIAL_HEIGHT),
        // links: initLinks, // maps pixel to relative url string
        map: initMap(INITIAL_WIDTH, INITIAL_HEIGHT), // new Map(), // initMap(),
        values: ["", "canada", "usa", "mexico", "brazil"],
        width: INITIAL_WIDTH
    },
    brushColor: INITIAL_BRUSH_COLOR
};

/*
function rootReducer(state = initialState, action) {
  return state;
};
*/
function rootReducer(state = initialState, action) {
    if (action.type === ADD_ARTICLE) {
        // state.articles.push(action.payload); // needs to be immutable
        /*
        return Object.assign({}, state, {
            articles: state.articles.concat(action.payload)
        });
        */
        return { ...state, articles: state.articles.concat(action.payload) };
    } else if (action.type === SET_MOUSE_DOWN) {
        return { ...state, mouseDown: action.payload };
    } else if (action.type === SET_BRUSH_COLOR) {
        // const brushColor = (); // assuming the payload hex color is a hex string
        return { ...state, brushColor: action.payload };
    } else if (action.type === SET_TILE) {
        // return state;
        var tiles = state.board.tiles.slice();
        var {x, y} = action.payload;
        //- console.log({x, y});
        const index = (action.payload.y * state.board.width) + action.payload.x;
        tiles[index] = action.payload.color;
        // alert("Set!");
        /*
        return { ...state, board: {
            tiles: tiles,
            width: 1
        }};
        */
        // alert("Set! " + x + ", " + y);
        return { ...state, board: {
            ...state.board,
            tiles: tiles
        }};
    }
    return state;
}

export default rootReducer;
