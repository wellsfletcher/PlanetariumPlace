import {xy2index, int2rgba, rgb2int} from '../utils/general';
import { values as colorValues, hexcolor2colorcode, colorcode2hexcolor } from '../constants/colors';
import * as API from '../utils/api';
import * as Time from '../utils/time';
import {BaseState} from "../reducers";


/**
 * Returns a hex color
 * @param pixelsRgba
 */
function getRgbHexIntFromPixelsRgba(pixelsRgba: Uint8ClampedArray, index: number): number {
    index = index * 4;
    let r = pixelsRgba[index + 0];
    let g = pixelsRgba[index + 1];
    let b = pixelsRgba[index + 2];
    // let a = pixelsRgba[index + 3];
    return rgb2int({r, g, b});
}

export function getWikidataidFromWikidataidBaseboard(wikidataidRgba: Uint8ClampedArray, {x, y}, width: number): string {
    const BLACK = 0x1B1B1B; // 1776411
    let result = "";
    if (wikidataidRgba.length <= 0) return result;

    const index = xy2index(x, y, width);
    const hexInt = getRgbHexIntFromPixelsRgba(wikidataidRgba, index);

    if (hexInt != 0 && hexInt != BLACK) {
        result = "Q" + hexInt;
    }

    return result;
}

/**
@colors hex integer array that maps integer color [0, 15] to hex values
*/
function buffer2hex(buffer: number[], colors: number[]): number[] {
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

function buffer2rgbabuffer(buffer: number[], colors: number[]): Uint8ClampedArray {
    const length = buffer.length;
    var result = new Uint8ClampedArray(new ArrayBuffer(length * 4));

    console.debug("Converting to RGBA buffer.");

    for (var k = 0; k < length; k++) {
        const colorCode = buffer[k];
        const color = colors[colorCode]; // TODO: make this be an rgba value instead of a hex one
        // const color = colors[5];
        appendRbgaPixel(result, k, color);
    }

    // console.log(result);

    return result;
}

export function appendRbgaPixel(pixelsRgba: Uint8ClampedArray, size: number, hexColor: number): void {
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
export function setRgbaPixel(pixelsRgba: Uint8ClampedArray, originalIndex: number, hexColor: number) {
    var index = originalIndex * 4;
    var {r, g, b, a} = int2rgba(hexColor);
    pixelsRgba[index + 0] = r;
    pixelsRgba[index + 1] = g;
    pixelsRgba[index + 2] = b;
    // pixelsRgba[index + 3] = a;
    pixelsRgba[index + 3] = 255;
}

/**
@buffer is Uint8Array (wait shouldn't it actually be Uint8ClampedArray) (wait what is it really?)
 I don't think it's Uint8Array
 TODO: figure out the proper type of the buffer arg
*/
export function setTiles(state: BaseState, buffer: number[]): any {
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

/*
Takes hex color as input.
*/
export function setTile(state: BaseState, {x, y}, width: number, color: number): any {
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

/**
Sets a tile without making a call to an API.
*/
export function setTileLocallyInternal(tiles: number[], tilesRgba: Uint8ClampedArray, state: any, index: number, width: number, color: number): any { // should use function chaining
    // var tiles = state.board.tiles.slice();
    // var tilesRgba = state.board.tilesRgba.slice();

    // const index = (y * width) + x;
    tiles[index] = color;
    setRgbaPixel(tilesRgba, index, color);

    const boardId = state.boardId;
    const colorCode = hexcolor2colorcode(color);

    return { ...state, board: {
        ...state.board,
        tiles: tiles,
        tilesRgba: tilesRgba
    }};
}

export function setTileLocally(state: BaseState, index: number, width: number, color: number): any { // should use function chaining
    var tiles = state.board.tiles.slice();
    var tilesRgba = state.board.tilesRgba.slice();
    // const width = state.board.width;

    index = Number(index);
    color = colorcode2hexcolor(Number(color));

    return setTileLocallyInternal(tiles, tilesRgba, state, index, width, color);
}

/*
function parseTileHistory(tileHistory) {

}
*/

/**
Takes list of tiles to be set as input.
{index, color, timestamp}
*/
export function importTiles(state: any, tileChanges: any): any {
    const width = state.board.width;

    var tiles = state.board.tiles.slice();
    var tilesRgba = state.board.tilesRgba.slice();

    for (var k = 0; k < tileChanges.length; k++) {
        var {index, color, timestamp} = tileChanges[k];
        index = Number(index);
        color = colorcode2hexcolor(Number(color));
        state = setTileLocallyInternal(tiles, tilesRgba, state, index, width, color);
        // console.log("set tile " + index + " to " + "color");
    }

    return state;
}

/**
Not actually used.
*/
// export function playChanges(state: any, unplayedChanges: any): any {
//     // should this pop the change from unplayedChanges
//     // should this also set the delay
//
//     var nextDelay = null;
//
//     // dequeue current unplayed change
//     const change = props.unplayedChanges.dequeue();
//     if (nextChange == undefined) {
//         setChangeDelay(nextDelay); return;
//     }
//     const {index, color, timestamp} = change;
//     // set the tile using that unplayed change
//     props.setLocalTile(index, color);
//     // peek at the next unplayed change to get the delay until it
//     const nextChange = props.unplayedChanges.peek();
//     if (nextChange == undefined) {
//         setChangeDelay(nextDelay); return;
//     }
//     nextDelay = Time.getRemaining(Time.addMillis(Time.str2date(nextChange.timestamp), TILE_UPDATE_OFFSET));
//     // set another timeout with that delay
//     setChangeDelay(nextDelay);
// }
