

export const INITIAL_BOARD_ID = 1;
export const INITIAL_WIDTH = 1024; // 512 // 1024 // 2048
export const INITIAL_HEIGHT = 512; // 256 // 512 // 1024
export const INITIAL_BRUSH_COLOR = 0x00D3DD; // 1752220;

export const TILE_UPDATE_FREQUENCY = 5000;
export const TILE_UPDATE_OFFSET = 6000;
// export const FLASHBACK_BOARD_PATH = "../../assets/pixel-countries-mid-res.png";
// export const FLASHBACK_BOARD_PATH = "../assets/pixel-countries-mid-res.png";
// export const FLASHBACK_BOARD_PATH = process.env.PUBLIC_URL + "/assets/pixel-countries-mid-res.png";
// TODO: rename this to FLASHBACK_BASEBOARD
import FLASHBACK_BOARD from '../assets/pixel-countries-mid-res.png';
export const FLASHBACK_BOARD_PATH = FLASHBACK_BOARD;
import COLORING_BASEBOARD from '../assets/COLORING.png';
export const COLORING_BASEBOARD_PATH = COLORING_BASEBOARD;
