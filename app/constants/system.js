

export const INITIAL_BOARD_ID = 1;
export const INITIAL_WIDTH = 1024; // 512 // 1024 // 2048
export const INITIAL_HEIGHT = 512; // 256 // 512 // 1024
export const INITIAL_BRUSH_COLOR = 0x00D3DD; // 1752220;

// TODO: improve this, so you can run npm build and start in both prod and dev
// export const BASE_PATH = "../";
export const BASE_PATH = (process.env.NODE_ENV === 'production') ? "" : "../../";

export const TILE_UPDATE_FREQUENCY = 5000;
export const TILE_UPDATE_OFFSET = 6000;
// export const FLASHBACK_BOARD_PATH = "../../assets/pixel-countries-mid-res.png";
// export const FLASHBACK_BOARD_PATH = "../assets/pixel-countries-mid-res.png";
// export const FLASHBACK_BOARD_PATH = process.env.PUBLIC_URL + "/assets/pixel-countries-mid-res.png";
// TODO: change how I am importing images here, since it's increasing transform.js file size unnecessarily
// TODO: rename this to FLASHBACK_BASEBOARD
// import FLASHBACK_BOARD from '../assets/pixel-countries-mid-res.png';
const FLASHBACK_BOARD = BASE_PATH + 'assets/pixel-countries-mid-res.png';
export const FLASHBACK_BOARD_PATH = FLASHBACK_BOARD;
// import COLORING_BASEBOARD from '../assets/COLORING.png';
const COLORING_BASEBOARD = BASE_PATH + 'assets/COLORING.png';
export const COLORING_BASEBOARD_PATH = COLORING_BASEBOARD;
// import WIKIDATAID_BASEBOARD from '../assets/WIKIDATAID.png';
const WIKIDATAID_BASEBOARD = BASE_PATH + 'assets/WIKIDATAID.png';
//const WIKIDATAID_BASEBOARD = BASE_PATH + 'assets/WIKIDATAID.png';
export const WIKIDATAID_BASEBOARD_PATH = WIKIDATAID_BASEBOARD;

// import HIGHLIGHTS_FOLDER from '../assets/highlights/';
// export const CANADA_HIGHLIGHT = HIGHLIGHTS_FOLDER + CANADA_HIGHLIGHT;

// import CANADA_HIGHLIGHT from '../assets/highlights/Q16.png';
// export const CANADA_HIGHLIGHT_PATH = CANADA_HIGHLIGHT;

// TODO: this probably won't work during npm run build, so fix it
// export const CANADA_HIGHLIGHT_PATH = '../assets/highlights/Q16.png';
// export const HIGHLIGHTS_FOLDER = '/app/assets/highlights/';
//- export const HIGHLIGHTS_FOLDER = `${process.env.PUBLIC_URL}app/assets/highlights/`;
// export const HIGHLIGHTS_FOLDER = `../assets/highlights/`;
export const HIGHLIGHTS_FOLDER = BASE_PATH + `assets/highlights/`;