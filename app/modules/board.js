import { xy2index } from '../utils/general';
import { values as colorValues } from '../constants/colors';


function buffer2hex(buffer, colors) {
    var result = [];
    const length = buffer.length;

    for (var k = 0; k < length; k++) {
        const colorCode = buffer[k];
        const color = colors[colorCode];
        // const color = colors[5];
        result.push(color);
    }

    return result;
}

function buffer2rgbbuffer(buffer, colors) {

}

/**
@buffer is Uint8Array
*/
export function setTiles(state, buffer) {
    const tiles = buffer2hex(buffer, colorValues);

    return { ...state, board: {
        ...state.board,
        tiles: tiles
    }};
}

export function setTile(state, {x, y}, width, color) {
    var tiles = state.board.tiles.slice();

    const index = (y * width) + x;
    tiles[index] = color;

    return { ...state, board: {
        ...state.board,
        tiles: tiles
    }};
}
