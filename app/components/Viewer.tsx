import Globe, {CanvasGlobeProps} from "./Globe";
import Board from "./Board";
import React, {useState} from "react";
import usePreloadedImage from "./hooks/usePreloadedImage";
import * as System from "../constants/system";
import useImage from "./hooks/useImage";
import {drawPixelRgbaBuffer, fillCanvasWithImage} from "../utils/draw";
import {Baseboard} from "../constants/Baseboard";
import useFancyCanvas from "./hooks/useFancyCanvas";
import {getHeightFromTilesRgba} from "../modules/board";

interface ViewerProps extends CanvasGlobeProps {
    useGlobe: boolean
}

const Viewer = (props: ViewerProps) => {
    const boardProps: CanvasGlobeProps = props;

    const viewFlashback = props.viewFlashback; // this is redundant now bc of activeBaseboard I tihnk
    const activeBaseboard = props.activeBaseboard;
    // const setViewFlashback = props.setViewFlashback;
    var tilesRgba = props.tilesRgba;
    // var tiles = props.tiles;
    var width = props.width;
    // removing Tiles array to improve performance
    var height = getHeightFromTilesRgba(tilesRgba, width);

    const [clickHandlerProps, setClickHandlerProps] = useState(null);

    // ------ new canvas code start ------ //
    const [flashBackImage, setFlashbackImage] = usePreloadedImage(System.FLASHBACK_BOARD_PATH);
    const [coloringBaseboardImage, setColoringBaseboardImage] = usePreloadedImage(System.COLORING_BASEBOARD_PATH);

    const highlightFileName = (props.activeCountry == null || props.activeCountry == "" ? "empty" : props.activeCountry) + ".png";
    // const highlightFileName = (props.activeCountry == null || props.activeCountry == "" ? "Q16" : props.activeCountry) + ".png";
    // console.log(["highlightFileName", highlightFileName]);
    // const [territoryHighlightImage, setTerritoryHighlightImage] = usePreloadedImage(System.CANADA_HIGHLIGHT_PATH);
    // wait is the functions input just the initial value? I think it's probably like just not done loading, when click it
    // TODO: figure out the above problem
    //- const [territoryHighlightImage, setTerritoryHighlightImage] = usePreloadedImage(System.HIGHLIGHTS_FOLDER + highlightFileName);
    // const [territoryHighlightImage, setTerritoryHighlightImage] = usePreloadedImage(System.HIGHLIGHTS_FOLDER + "Q16.png");
    const territoryHighlightImage = useImage(System.HIGHLIGHTS_FOLDER + highlightFileName);
    const boardImages = [flashBackImage, coloringBaseboardImage, territoryHighlightImage];

    // console.log(["System.CANADA_HIGHLIGHT_PATH", System.CANADA_HIGHLIGHT_PATH]);

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

    // const options = {
    //     context: "2d"
    // };
    // const { context, ...moreConfig } = options;
    const canvasRef = useFancyCanvas(layers);
    // ------ new canvas code end ------ //

    // ------ disgusting Board click-handling code start ------ //

    // ------ disgusting Board click-handling code end ------ //

    const rest = {
        width: width,
        height: height,
        style: {
            // Commented out bc of TS error
            //- imageRendering: "pixelated",
            imageRendering: "pixelated" as "pixelated",
            cursor: "crosshair",
            display: props.useGlobe ? "none" : "initial" // not sure if there's like a default option or something // block
        }
    };

    // // Board canvas props
    // const rest = {
    //     width: width,
    //     height: height,
    //     // onMouseDown: handleCanvasClick, // onClick // onMouseDown
    //     // onMouseMove: handleMouseEnter, // this can be on the outside div or on the canvas itself // actually it can't or it'll be called when it shouldn't
    //     style: {
    //         // commenting out bc ts error
    //         imageRendering: "pixelated" as "pixelated", // crisp-edges // pixelated // tf is this bs
    //         cursor: "crosshair"
    //     }
    // };

    // // Globe canvas props
    // const rest = {
    //     width: width,
    //     height: height,
    //     style: {
    //         // Commented out bc of TS error
    //         //- imageRendering: "pixelated",
    //         cursor: "crosshair",
    //         display: "none"
    //     }
    // };

    // const clickHandlerProps = {
    //     // onPointerUp: handleCanvasClick,
    //     onTouchEnd: handleCanvasClick,
    //     onClick: handleCanvasClick, // this will never fire on mobile (trust me I tested it); It doesn't cause any issues as of now though
    //     // onMouseMove: handleMouseEnter
    // }

    //             {...clickHandlerProps}


    // const boardViewer = (!props.useGlobe) ?
    //     <Board
    //         {...boardProps}
    //         canvasRef={canvasRef}
    //         /*{mouseDown={props.mouseDown}*/
    //     />
    //     :
    //     <Globe
    //         {...boardProps}
    //         canvasRef={canvasRef}
    //     />
    // ;
    const viewerCanvas = <canvas
        ref={canvasRef}
        {...rest}
        {...clickHandlerProps}
    />;

    const boardViewer = (!props.useGlobe) ?
        <>
            <Board
                {...boardProps}
                canvasRef={canvasRef}
                /*{mouseDown={props.mouseDown}*/
                setClickHandlerProps={setClickHandlerProps}
            >
                {viewerCanvas}
            </Board>
        </>
        :
        <>
            <Globe
                {...boardProps}
                canvasRef={canvasRef}
                dependencies={boardImages}
            />
            {viewerCanvas}
        </>
    ;
    return <>
        {boardViewer}
        {/*<canvas*/}
        {/*    ref={canvasRef}*/}
        {/*    {...rest}*/}
        {/*/>*/}
    </>
}

export default Viewer;
