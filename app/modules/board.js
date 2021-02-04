import { xy2index, int2rgba } from '../utils/general';
import { values as colorValues, hexcolor2colorcode } from '../constants/colors';
import * as API from '../utils/api';


function buffer2hex(buffer, colors) {
    var result = [];
    const length = buffer.length;
    // console.log(buffer);

    for (var k = 0; k < length; k++) {
        const colorCode = buffer[k];
        const color = colors[colorCode];
        // const color = colors[5];
        result.push(color);
    }

    // console.log(result);
    return result;
}

function buffer2rgbabuffer(buffer, colors) {
    const length = buffer.length;
    var result = new Uint8ClampedArray(new ArrayBuffer(length * 4));

    console.log("Converting to RGBA buffer.");

    for (var k = 0; k < length; k++) {
        const colorCode = buffer[k];
        const color = colors[colorCode]; // TODO: make this be an rgba value instead of a hex one
        // const color = colors[5];
        appendRbgaPixel(result, k, color);
    }

    // console.log(result);

    return result;
}

export function appendRbgaPixel(pixelsRgba, size, hexColor) {
    /*
    var rgba = int2rgba(hexColor);
    pixelsRgba[size + 0] = rgba.r;
    pixelsRgba[size + 1] = rgba.g;
    pixelsRgba[size + 2] = rgba.b;
    pixelsRgba[size + 3] = rgba.a;
    */
    setRgbaPixel(pixelsRgba, size, hexColor);
}

/**
@param originalIndex the index before being multiplied by 4
 */
export function setRgbaPixel(pixelsRgba, originalIndex, hexColor) {
    var index = originalIndex * 4;
    var {r, g, b, a} = int2rgba(hexColor);
    pixelsRgba[index + 0] = r;
    pixelsRgba[index + 1] = g;
    pixelsRgba[index + 2] = b;
    // pixelsRgba[index + 3] = a;
    pixelsRgba[index + 3] = 255;
}

/**
@buffer is Uint8Array
*/
export function setTiles(state, buffer) {
    const tiles = buffer2hex(buffer, colorValues);
    const tilesRgba = buffer2rgbabuffer(buffer, colorValues);
    // console.log(state.board.tiles);
    // return state;
    return { ...state, board: {
        ...state.board,
        tiles: tiles,
        tilesRgba: tilesRgba
    }};
}

export function setTile(state, {x, y}, width, color) {
    var tiles = state.board.tiles.slice();
    var tilesRgba = state.board.tilesRgba.slice(); // mayhaps remove slicing?

    const index = (y * width) + x;
    tiles[index] = color;
    setRgbaPixel(tilesRgba, index, color);

    const boardId = state.boardId;
    const colorCode = hexcolor2colorcode(color);
    API.draw(boardId, {x, y}, colorCode);

    return { ...state, board: {
        ...state.board,
        tiles: tiles,
        tilesRgba: tilesRgba
    }};
}
