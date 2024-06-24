import React from 'react';
import { connect } from "react-redux";
// import { setTile } from "../actions/index";

import { MapInteractionCSS } from 'react-map-interaction';
import Tooltip from '@material-ui/core/Tooltip';

import { useState, useEffect } from 'react';
// import { useSwipeable, Swipeable } from 'react-swipeable';
import { useSwipeable } from 'react-swipeable';
// import { usePinch, useGesture } from 'react-use-gesture';

import useCanvas from './hooks/useCanvas';
import useSwiping from './hooks/useSwiping';
import usePreloadedImage from './hooks/usePreloadedImage';
import * as System from '../constants/system';
import { int2rgba, vector2index } from '../utils/general';
import { drawPixel, drawPixelBuffer, drawPixelRgbaBuffer, drawImageData, paintCanvasBlack, fillCanvasWithImage } from '../utils/draw';
import {CanvasGlobeProps} from "./Globe";
import useFancyCanvas from "./hooks/useFancyCanvas";
import {Baseboard} from "../constants/Baseboard";
import useImage from "./hooks/useImage";
import {getWikidataidFromWikidataidBaseboard} from "../modules/board";
// import Tooltip from './TrackingTooltip.js';


/*
function mapDispatchToProps(dispatch) {
  return {
    setTile: ({x, y}, color) => dispatch(setTile({x, y, color}))
  };
}
*/

function round(num: number) {
    // 0.375 seems to work for y
    // .40625
    return Math.floor(num + 0.0);
}

var drawAnimatedCircle = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI);
    ctx.fill();
};

const extractPixelBufferFromMap = (map, selectedId) => {
    var result = [];
    const highlightColor = 0x88ffdf65; // 16768869; // 0xffdf65
    for (var ids of map) {
        var color = 0x00000000;// 1752220;
        if (selectedId == 0) {

        } else if (selectedId == ids) { // selectedId in ids
            color = highlightColor;
            // console.log("highlighted");
        }
        result.push(color);
    }
    return result;
};

const drawSelection = (ctx, map, bufferWidth, selectedId) => {
    var pixels = extractPixelBufferFromMap(map, selectedId);
    const hasAlpha = true;
    return drawPixelBuffer(ctx, pixels, bufferWidth, hasAlpha); // currently not used
};

const Highlights = (props) => {
    const { map, values, width, selectedTile, ...otherProps } = props;
    var height = map.length / width;

    var index, selectedIds, value;
    value = "";
    if (selectedTile != null) {
        index = vector2index(selectedTile, width);
        selectedIds = map[index];
        value = values[selectedIds];
    }

    const [mapCache, setMapCache] = React.useState(new Map());

    var draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (selectedTile == null) return;
        // drawPixelBuffer(ctx, map, width);
        var index = vector2index(selectedTile, width);
        // var value = props.values[props.map[index]];
        // console.log("selected = " + selectedIds);
        // drawSelection(ctx, map, width, selectedIds);
        if (mapCache.has(selectedIds)) {
            const highlightImageData = mapCache.get(selectedIds);
            drawImageData(ctx, highlightImageData);
        } else {
            const highlightImageData = drawSelection(ctx, map, width, selectedIds);
            mapCache.set(selectedIds, highlightImageData);
            setMapCache(mapCache);
            // setMapCache(new Map(mapCache));
        }
    };

    // const options = {
    //     context: "2d"
    // };
    // const { context, ...moreConfig } = options;
    const canvasRef = useCanvas(draw);

    const canvas = canvasRef.current;

    const rest = {
        width: width,
        height: height,
        style: {
            // Commenting out bc ts error
            imageRendering:  "pixelated" as "pixelated",
            /*
            imageRendering: "-moz-crisp-edges",
            imageRendering: "-webkit-crisp-edges",
            imageRendering: "crisp-edges",
            */
            position: "absolute",
            // zIndex: 100,
            cursor: "crosshair"
        }
    };

    // followCursor property will soon exist...
    return (
        <Tooltip title={value} arrow>
            <canvas
                ref={canvasRef}
                {...rest}
                {...otherProps}
            />
        </Tooltip>
    );
}

// I have to update my dependencies (I think react in particular) to be able to convert this file to TS
const Board = (props: CanvasGlobeProps) => {
    var tilesRgba = props.tilesRgba;
    var tiles = props.tiles;
    var width = props.width;
    var height = tiles.length / width;

    const viewFlashback = props.viewFlashback;
    const activeBaseboard = props.activeBaseboard;

    const [selectedTile, setSelectedTile] = React.useState(null); // {x: 0, y: 0}

    // // ------ old canvas code start ------ //
    // const [flashBackImage, setFlashbackImage] = usePreloadedImage(System.FLASHBACK_BOARD_PATH);
    //
    // var draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    //     // drawAnimatedCircle(ctx, frameCount);
    //     // drawPixel(ctx, 69, 42);
    //     // has redraw the pixel buffer every time when I do it like this
    //     // but this is the only way to do it in a reacty way methinks
    //     // unless maybe if lifecycle methods could solve my problems?
    //     // drawPixelBuffer(ctx, tiles, width);
    //
    //     // drawPixelRgbaBuffer(ctx, tilesRgba, width);
    //     if (!viewFlashback) {
    //         drawPixelRgbaBuffer(ctx, tilesRgba, width);
    //     } else {
    //         // paintCanvasBlack(ctx, width, height);
    //         // fillCanvasWithImage(ctx, "../../assets/pixel-countries-mid-res.png", width, height);
    //         fillCanvasWithImage(ctx, flashBackImage, width, height);
    //     }
    // };
    //
    //
    // // const options = {
    // //     context: "2d"
    // // };
    // // const { context, ...moreConfig } = options;
    // const canvasRef = useCanvas(draw);
    // // ------ old canvas code end ------ //


    // ------ new canvas code start ------ //
    const [flashBackImage, setFlashbackImage] = usePreloadedImage(System.FLASHBACK_BOARD_PATH);
    const [coloringBaseboardImage, setColoringBaseboardImage] = usePreloadedImage(System.COLORING_BASEBOARD_PATH);

    const highlightFileName = (props.activeCountry == null || props.activeCountry == "" ? "empty" : props.activeCountry) + ".png";
    const territoryHighlightImage = useImage(System.HIGHLIGHTS_FOLDER + highlightFileName);
    // const boardImages = [flashBackImage, coloringBaseboardImage, territoryHighlightImage];

    const drawBoard = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        drawPixelRgbaBuffer(ctx, tilesRgba, width);
    }
    const drawFlashback = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (flashBackImage != null) {
            fillCanvasWithImage(ctx, flashBackImage, width, height);
        }
    }
    const drawColoringBaseboard = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (coloringBaseboardImage != null) {
            fillCanvasWithImage(ctx, coloringBaseboardImage, width, height);
        }
    }
    const drawHighlight = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (territoryHighlightImage != null) {
            fillCanvasWithImage(ctx, territoryHighlightImage, width, height);
        }
    }

    let layers = [];
    if (activeBaseboard == Baseboard.FLASHBACK) {
        layers = [drawFlashback, drawHighlight];
    } else if (activeBaseboard == Baseboard.COLORING) {
        layers = [drawColoringBaseboard, drawHighlight];
    } else {
        layers = [drawBoard, drawHighlight];
    }

    const canvasRef = useFancyCanvas(layers);
    // ------ new canvas code end ------ //


    const canvas = canvasRef.current;

    // const isSwiping = useSwiping();
    // const isSwiping = false;

    // refactored bc TS error
    // const [isSwiping, setSwiping] = useState(false);
    // const [isPinching, setPinching] = useState(false);
    // const swipeHandlers = useSwipeable({
    //     onSwiped: (eventData) => setSwiping(false),
    //     onSwiping: (eventData) => setSwiping(true),
    // }, {
    //     preventDefaultTouchmoveEvent: true
    // });

    const [isSwiping, setSwiping] = useState(false);
    const [isPinching, setPinching] = useState(false);
    const swipeHandlers = useSwipeable({
        onSwiped: (eventData) => setSwiping(false),
        onSwiping: (eventData) => setSwiping(true),
        //----- preventDefaultTouchmoveEvent: true // I'm pretty sure this property is supposed to be true
    });

    const INITIAL_SCALE = 1.0;
    const INITIAL_CANVAS_WIDTH = width * INITIAL_SCALE;
    const INITIAL_CANVAS_HEIGHT = height * INITIAL_SCALE;
    const MAP_SCALE_TOLERANCE = 0.001;
    const [mapScale, setMapScale] = useState(1.0);
    const [mapTransform, setMapTransform] = useState({
        scale: INITIAL_SCALE,
        translation: {
            x: (window.innerWidth - INITIAL_CANVAS_WIDTH) / 2,
            y: (window.innerHeight - INITIAL_CANVAS_HEIGHT) / 2
        }
    });
    const [mapScaleOnTouchStart, setMapScaleOnTouchStart] = useState(1.0);
    const onMapChange = (transform) => {
        setMapTransform(transform);
        setMapScale( transform.scale );
    };
    const onMapTouchStart = () => setMapScaleOnTouchStart(mapScale);

    var zoom = {x: 1, y: 1};
    var pan = {x: -100, y: 50};
    var zoomedWidth = width * zoom.x;
    var zoomedHeight = height * zoom.y;

    const handleCanvasClick = (event) => {
        if (event.defaultPrevented) return; // console.log("drag!");
        //-- if (viewFlashback) return;
        if (isSwiping || isPinching ) {
            //- console.log("Click aborted");
            return;
        }
        if (event.type == 'touchend') {
            var deltaScale = mapScaleOnTouchStart - mapScale;
            // console.log("deltaScale = " + deltaScale + " = " + mapScaleOnTouchStart + " - " + mapScale);
            if (Math.abs(deltaScale) > MAP_SCALE_TOLERANCE) {
                //- console.log("Click do be aborted");
                return;
            }
        }
        // console.log(event);

        const rect = canvas.getBoundingClientRect();
        // zoom = {x: canvas.width / rect.width,  y: canvas.height / rect.height};
        zoom = {x: rect.width / canvas.width,  y: rect.height / canvas.height};
        var screenPosition = {x: 0, y: 0};

        // if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        if (event.type == 'touchend') {
            var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
            // var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            // var touch = evt.touches[0] || evt.changedTouches[0];
            var touch = evt.changedTouches[0];
            screenPosition = {x: touch.pageX, y: touch.pageY};
        } else {
            screenPosition = {x: event.clientX, y: event.clientY};
        }

        const mouse = {x: round((screenPosition.x - rect.left) / zoom.x), y: round((screenPosition.y - rect.top)/ zoom.y)};
        var color = props.brushColor;

        // try getting the wikidataid of the clicked on tile here
        let wikidataid = getWikidataidFromWikidataidBaseboard(props.wikidataidRgba, mouse, width);
        // then try using setActiveCountry to change the highlighted country
        // temporary
        //- props.setActiveCountry(wikidataid);

        // exit if in view flashback mode
        if (viewFlashback) {
            props.setViewFlashback(false);
            return;
        }

        if (activeBaseboard != Baseboard.INTERACTIVE) {
            props.setActiveBaseboard(Baseboard.INTERACTIVE);
            return;
        }

        props.setTile(mouse, color);
        // alert("Clicked!");

        // save the canvas
        // var dataUrl = canvas.toDataURL("image/png");
        // var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        // console.log(dataUrl);
    }

    const rest = {
        width: width,
        height: height,
        // onMouseDown: handleCanvasClick, // onClick // onMouseDown
        // onMouseMove: handleMouseEnter, // this can be on the outside div or on the canvas itself // actually it can't or it'll be called when it shouldn't
        style: {
            // commenting out bc ts error
            imageRendering: "pixelated" as "pixelated", // crisp-edges // pixelated // tf is this bs
            cursor: "crosshair"
        }
    };

    /*
    const tooltip = (
        <Tooltip title="Delete">
            <canvas
                ref={canvasRef}
                {...rest}
            />
        </Tooltip>
    );
    */

    const clickHandlerProps = {
        // onPointerUp: handleCanvasClick,
        onTouchEnd: handleCanvasClick,
        onClick: handleCanvasClick, // this will never fire on mobile (trust me I tested it); It doesn't cause any issues as of now though
        // onMouseMove: handleMouseEnter
    }

    /*
    const highligths = (
        <Highlights
            width={width}
            map={props.map}
            values={props.values}
            selectedTile={selectedTile}

            {...clickHandlerProps}
        />
    );
    */
    const highligths = (<> </>);

    // change map value later
    // const { height, width } = useWindowDimensions();
    return (
        <MapInteractionCSS
            minScale={.125}
            maxScale={32}
            value={mapTransform}
            onChange={onMapChange}
            defaultValue={{
                scale: INITIAL_SCALE,
                translation: {
                    x: (window.innerWidth - INITIAL_CANVAS_WIDTH) / 2,
                    y: (window.innerHeight - INITIAL_CANVAS_HEIGHT) / 2
                }
            }}
        >
            {highligths}
            <div
            {...swipeHandlers}
            onTouchStart={onMapTouchStart}
            >
            <canvas
                ref={canvasRef}
                {...rest}
                {...clickHandlerProps}
            />
            </div>
        </MapInteractionCSS>
    );
}

export default Board;
