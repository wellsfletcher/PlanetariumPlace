import React from 'react';
import { connect } from "react-redux";
import { setTile } from "../actions/index";

import { MapInteractionCSS } from 'react-map-interaction';
import Tooltip from '@material-ui/core/Tooltip';

import useCanvas from './useCanvas';
import { int2rgba, vector2index } from '../utils/general';
import { drawPixel, drawPixelBuffer, drawImageData } from '../utils/draw';
// import Tooltip from './TrackingTooltip.js';


/*
function mapDispatchToProps(dispatch) {
  return {
    setTile: ({x, y}, color) => dispatch(setTile({x, y, color}))
  };
}
*/

function round(num) {
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
    return drawPixelBuffer(ctx, pixels, bufferWidth, hasAlpha);
};

const Highlights = (props) => {
    const { map, values, width, selectedTile, ...otherProps } = props;
    var height = map.length / width;
    /*
    var map = props.map;
    // var values = props.values;
    var width = props.width;
    var height = map.length / width;
    var selectedTile = props.selectedTile;
    // var selectedValue = props.selectedValue;
    */
    var index, selectedIds, value;
    value = "";
    if (selectedTile != null) {
        index = vector2index(selectedTile, width);
        selectedIds = map[index];
        value = values[selectedIds];
    }

    const [mapCache, setMapCache] = React.useState(new Map());

    var draw = (ctx, frameCount) => {
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

    const options = {
        context: "2d"
    };
    const { context, ...moreConfig } = options;
    const canvasRef = useCanvas(draw, {context});
    const canvas = canvasRef.current;

    const rest = {
        width: width,
        height: height,
        style: {
            imageRendering: "pixelated",
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

const Board = (props) => {
    var tiles = props.tiles;
    var width = props.width;
    var height = tiles.length / width;

    const [selectedTile, setSelectedTile] = React.useState(null); // {x: 0, y: 0}

    var draw = (ctx, frameCount) => {
        // drawAnimatedCircle(ctx, frameCount);
        // drawPixel(ctx, 69, 42);
        // has redraw the pixel buffer every time when I do it like this
        // but this is the only way to do it in a reacty way methinks
        // unless maybe if lifecycle methods could solve my problems?
        drawPixelBuffer(ctx, tiles, width);
    };

    const options = {
        context: "2d"
    };
    const { context, ...moreConfig } = options;
    const canvasRef = useCanvas(draw, {context});
    const canvas = canvasRef.current;

    var zoom = {x: 1, y: 1};
    var pan = {x: -100, y: 50};
    var zoomedWidth = width * zoom.x;
    var zoomedHeight = height * zoom.y;

    const handleCanvasClick = (event) => {
        if (event.defaultPrevented) return; // console.log("drag!");
        console.log(event);

        const rect = canvas.getBoundingClientRect();
        // zoom = {x: canvas.width / rect.width,  y: canvas.height / rect.height};
        zoom = {x: rect.width / canvas.width,  y: rect.height / canvas.height};
        /*
        const rect = {
            left: width - zoomedWidth,
            top: height - zoomedHeight
        };
        */
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
        props.setTile(mouse, color);
        // alert("Clicked!");

        // save the canvas
        // var dataUrl = canvas.toDataURL("image/png");
        // var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        // console.log(dataUrl);
    }

    const handleMouseEnter = (event) => {
        // if (event.defaultPrevented) return;
        if (props.mouseDown) return;

        if (canvas === null) return; // I'm not sure why it gives me an error when this is line isn't here...
        const rect = canvas.getBoundingClientRect();
        // zoom = {x: canvas.width / rect.width,  y: canvas.height / rect.height};
        zoom = {x: rect.width / canvas.width,  y: rect.height / canvas.height};
        /*
        const rect = {
            left: width - zoomedWidth,
            top: height - zoomedHeight
        };
        */
        const mouse = {x: round((event.clientX - rect.left) / zoom.x), y: round((event.clientY - rect.top)/ zoom.y)};
        // const mouse = {x: Math.floor((event.clientX - rect.left) / zoom.x), y: Math.floor((event.clientY - rect.top)/ zoom.y)};
        //  const mouse = {x: ((event.clientX - rect.left) / zoom.x), y: ((event.clientY - rect.top)/ zoom.y)};
        // const mouse = {x: Math.floor(event.clientX / zoom.x), y: Math.floor(event.clientY / zoom.y)};
        // const mouse = {x: Math.floor(event.clientX / 1), y: Math.floor(event.clientY / 1)};
        var color = 1;

        if (props.mouseDown) {
            //- props.setTile(mouse, color);
            // alert("Clicked!");
            // console.log(mouse);
            // setSelectedTile();
        }

        setSelectedTile(mouse);
        var index = vector2index(mouse, width);
        var value = props.values[props.map[index]];
        // var value = index; // props.map[index];
        // console.log(value);
    }

    /*
    const options = {
        context: "2d"
    };
    const rest = {
        width: width,
        height: height,
        onMouseMove: handleMouseEnter
    };
    const { context, ...moreConfig } = options;
    const canvasRef = useCanvas(draw, {context});
    */

    const rest = {
        width: width,
        height: height,
        // onMouseDown: handleCanvasClick, // onClick // onMouseDown
        // onMouseMove: handleMouseEnter, // this can be on the outside div or on the canvas itself // actually it can't or it'll be called when it shouldn't
        style: {
            imageRendering: "pixelated", // crisp-edges // pixelated
            cursor: "crosshair"
        }
    };

    /*
    onClick={handleCanvasClick}
    onMouseMove={handleMouseEnter}
    */
    /*
    return (
        <div
            style={style}
        >
            <canvas
                ref={canvasRef}
                {...rest}
            />
        </div>
    );
    */

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

    /*
    const clickHandlerProps = {
        onTouchEnd: handleCanvasClick,
        onClick: handleCanvasClick,
        onMouseMove: handleMouseEnter
    }
    */
    const clickHandlerProps = {
        // onPointerUp: handleCanvasClick,
        // onTouchEnd: handleCanvasClick,
        onClick: handleCanvasClick,
        // onMouseMove: handleMouseEnter
    }

    /*
    onTouchEnd={handleCanvasClick}
    onClick={handleCanvasClick}
    onMouseMove={handleMouseEnter}
    */
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

    // const { height, width } = useWindowDimensions();
    const INITIAL_SCALE = 1.0;
    const INITIAL_CANVAS_WIDTH = width * INITIAL_SCALE;
    const INITIAL_CANVAS_HEIGHT = height * INITIAL_SCALE;
    return (
        <MapInteractionCSS
            minScale={.125}
            maxScale={32}
            defaultValue={{
                scale: INITIAL_SCALE,
                translation: {
                    x: (window.innerWidth - INITIAL_CANVAS_WIDTH) / 2,
                    y: (window.innerHeight - INITIAL_CANVAS_HEIGHT) / 2
                }
            }}
        >
            {highligths}
            <canvas
                ref={canvasRef}
                {...rest}
                {...clickHandlerProps}
            />
        </MapInteractionCSS>
    );
}

export default Board;
