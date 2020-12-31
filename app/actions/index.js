import { ADD_ARTICLE, SET_TILE, SET_MOUSE_DOWN, SET_BRUSH_COLOR } from "../constants/actionTypes";


export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
};

export function setTile(payload) {
  return { type: SET_TILE, payload };
};

export function setMouseDown(payload) {
  return { type: SET_MOUSE_DOWN, payload };
};

export function setBrushColor(payload) {
  return { type: SET_BRUSH_COLOR, payload };
};
