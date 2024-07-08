import React, {CSSProperties} from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';

import { connect } from "react-redux";
import { fetchTiles, fetchTileChanges} from "../actions"; // these should get moved
import { actions } from "../reducers";
import { bindActionCreators } from 'redux';

import { useInterval } from './hooks/useInterval';
import { useTimeout } from './hooks/useTimeout';

import Board from './Board';
import Globe from './Globe';
// import PersistentSearchDrawer from './PersistentSearchDrawer';
import PersistentSearchDrawer2 from './PersistentSearchDrawer2';
import TabBar from './TabBar';
import VerticalColorPicker from './VerticalColorPicker';
import Overlay from './Overlay';
import { hexcolor2int } from '../utils/general';
import * as Time from '../utils/time';
import * as System from '../constants/system';
// import * as Board from '../modules/board';
// import useWindowDimensions from './useWindowDimensions';

//- import { CSSProperties } from "react";


import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
/*
import GlobeIcon from '@mui/icons-material/Public';
import MapIcon from '@mui/icons-material/Map';
import ViewIcon from '@mui/icons-material/History'; // Visibility, HourglassFullTwoTone, History
import ViewOffIcon from '@mui/icons-material/FastForward'; // VisibilityOff, HourglassEmpty, Update, FastForward
import AddIcon from '@mui/icons-material/Add';
*/

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    //- getData: () => getData()(dispatch), //  cursed
    // getData: () => getData(dispatch),
    fetchTiles: () => fetchTiles()(dispatch),
    fetchTileChanges: (lastUpdated: Date, boardId: number) => fetchTileChanges()(lastUpdated, boardId, dispatch),
    // fetchTileChanges: bindActionCreators(({x, y}, color) => setTile({x, y, color}), dispatch),
    // setTile: ({x, y}, color) => dispatch(setTile({x, y, color})),
    setTile: bindActionCreators(({x, y}, color) => actions.setTile({x, y, color}), dispatch),
    setLocalTile: bindActionCreators((index, color) => actions.setLocalTile({index, color}), dispatch),
    playChange: bindActionCreators((change) => actions.playChange({change}), dispatch),
    setBoardId: bindActionCreators(actions.setBoardId, dispatch),
    setActiveCountry: bindActionCreators(actions.setActiveCountry, dispatch),
    // setBrushColor: (color) => dipatch(setBrushColor(color))
    // setBrushColor: bindActionCreators((color) => dipatch(setBrushColor(color)), dispatch) // no work
    // setBrushColor: bindActionCreators((color) => setBrushColor(color), dispatch) // works
    setBrushColor: bindActionCreators(actions.setBrushColor, dispatch)
  };
}

import { useSelector } from 'react-redux';
import {useAppSelector} from "./hooks/redux";
import {AppDispatch} from "../store";
import {Baseboard} from "../constants/Baseboard";
import usePixelsFromImage from "./hooks/usePixelsFromImage";
import HiddenCanvas from "./HiddenCanvas";
import Viewer from "./Viewer";
// import {useAppSelector} from "./hooks/redux";
const mapStateToProps = (state) => { // this will be placed with a bunch of selectors
    return {
        // boardId: state.boardId,
        boardId: state.boardId,
        // lastUpdated: state.board.lastUpdated,
        // unplayedChanges: state.board.unplayedChanges,
        // articles: state.articles,
        // remoteTiles: state.remoteTiles,


        /*
        // tilesRgba: state.board.tilesRgba,
        tiles: state.board.tiles,
        tilesRgba: state.board.tilesRgba,
        map: state.board.map,
        values: state.board.values,
        width: state.board.width,
        // mouseDown: state.mouseDown,
        activeCountry: state.board.activeCountry,
        brushColor: state.brushColor
        */
    };
};

// TODO: simplify this code so we don't need the extra type definition (and just like use State instead or something)
interface BoardProps {
    tilesRgba: Uint8ClampedArray,
    // tiles: number[],
    wikidataidRgba: Uint8ClampedArray, // technically should equal maybe new Uint8ClampedArray(new ArrayBuffer(System.INITIAL_WIDTH * System.INITIAL_HEIGHT * 4)),
    // map: number[],
    // values: string[],
    activeCountry: string,
    setActiveCountry: (value: string) => void,
    width: number,
    // mouseDown: any,
    brushColor: number,
    viewFlashback: boolean,
    setViewFlashback: (value: boolean) => void,
    activeBaseboard: Baseboard,
    setActiveBaseboard: (value: Baseboard) => void,
    setTile: ({x, y}, color: number) => void,
}

interface BoardPageProps extends BoardProps {
    fetchTiles: any,
    fetchTileChanges: any,
    // setLocalTile: any,
    // playChange: any,
    // setBoardId: any,
    setActiveCountry: any,
    setBrushColor: any,
    boardId: number,
}

// export default class MainPage extends React.Component {
const MainPage = (props: any) => {
    // console.log("something is happening right now");
    // why is this being done?
    // oh I'm just only logging this one sometimes
    // const tiles = useAppSelector(state => { // const tiles = useAppSelector(state => { // causes issues
    //     // console.log(state);
    //     // console.log(state.board);
    //     return state.board.tiles;
    // });
    const tilesRgba = useAppSelector(state => state.board.tilesRgba);
    // const map = useAppSelector(state => state.board.map);
    // const values = useAppSelector(state => state.board.values);
    const width = useAppSelector(state => state.board.width);
    const activeCountry = useAppSelector(state => state.board.activeCountry);
    const brushColor = useAppSelector(state => state.brushColor);

    // console.log(tiles);

    props = { tilesRgba, width, activeCountry, brushColor, ...props };
    // console.log("cool beans");

        // const style: CSSProperties = { // may wanna move this elsewhere and delet the div
        const style: CSSProperties = {
            position: "absolute",
            width: "100%",
            height: "100%",
            overflow: "hidden"
        };

        React.useEffect(() => {
            props.fetchTiles();
            // props.getData();
            // alert("doing something");
        }, [props.boardId]);
        // }, []);
        // console.log(props.remoteTiles);

        const TILE_UPDATE_FREQUENCY = System.TILE_UPDATE_FREQUENCY;
        const TILE_UPDATE_OFFSET = System.TILE_UPDATE_OFFSET;
        // setInterval(() => {

        // July 6, 2024: temporarily commenting this out, since it's causing performance issues on safari; TODO: investigate this
        useInterval(() => {
            console.debug("updating async tiles...");
            const placeholderDate = new Date();
            //- props.fetchTileChanges(props.boardId, placeholderDate);
            props.fetchTileChanges(placeholderDate, props.boardId); // wait this would be the current time right? it should be props.lastUpdated right? nah it looks all good in the console
            // props.fetchTileChanges(props.boardId, props.lastUpdated);
            // props.fetchTileChanges(1, new Date());

            // play a bunch of actions after some time (the delay is stored in the payload)
            // this shit needs to get run after tile changes have been fetched
            /*
            console.log(props.unplayedChanges);
            while (!props.unplayedChanges.isEmpty()) {
                let change = props.unplayedChanges.dequeue();
                console.log(change);
                props.playChange(change);
            }
            */
        }, TILE_UPDATE_FREQUENCY);

        const onChangeComplete = (color) => {
            var brushColorInt = hexcolor2int(color);
            // alert("painting = " + brushColorInt);
            props.setBrushColor(brushColorInt);
        };

        const [viewFlashback, setViewFlashback] = React.useState(false);
        const [activeBaseboard, setActiveBaseboard] = React.useState(Baseboard.INTERACTIVE);
        const [tool, setTool] = React.useState(0);
        // TODO: move this to be inside the Viewer component
        const [wikidataidRgba, wikidataidCanvasRef] = usePixelsFromImage(System.WIKIDATAID_BASEBOARD_PATH);

        // var tiles = [];
        const boardProps: BoardProps = {
            tilesRgba: props.tilesRgba,
            // tiles: props.tiles,
            wikidataidRgba: wikidataidRgba,
            // map: props.map,
            // values: props.values,
            width: props.width,
            // mouseDown: props.mouseDown,
            brushColor: props.brushColor,
            activeCountry: props.activeCountry,
            setActiveCountry: props.setActiveCountry,
            viewFlashback: viewFlashback,
            setViewFlashback: setViewFlashback,
            activeBaseboard: activeBaseboard,
            setActiveBaseboard: setActiveBaseboard,

            setTile: props.setTile
        }

        const NUM_BOARD_IDS = 2;

        const [useGlobe, setUseGlobe] = React.useState(true);
        // const boardViewer = (!useGlobe) ?
        //     <Board
        //         {...boardProps}
        //     /*{mouseDown={props.mouseDown}*/
        //     />
        //     :
        //     <Globe
        //         {...boardProps}
        //     />
        // ;

        // if you start seeing performance issues, maybe have the first thing you try to do be this:
        // the activeCountry issue still seems to be a problem even with pagination; issues is especially noticable on safari
        // activeCountry={""} instead of activeCountry={props.activeCountry}, bc that would make sense to me, and that could've been what was causing issues on iphone last time
        // I think that actually might be the problem; TODO: investigate this
        return (
            <>
                <div style={style}>
                    {/*<PersistentSearchDrawer*/}
                    {/*    onChangeComplete={onChangeComplete}*/}
                    {/*    activeCountry={""}*/}
                    {/*    setActiveCountry={props.setActiveCountry}*/}
                    {/*>*/}
                    {/*</PersistentSearchDrawer>*/}
                    <PersistentSearchDrawer2
                        onChangeComplete={onChangeComplete}
                        // activeCountry={props.activeCountry}
                        activeCountry={""}
                        setActiveCountry={props.setActiveCountry}
                    >
                    </PersistentSearchDrawer2>
                    {/*{boardViewer}*/}
                    <Viewer
                        {...boardProps}
                        useGlobe={useGlobe}
                    />
                </div>
                <Overlay
                    onChangeComplete={onChangeComplete}
                    useGlobe={useGlobe} setUseGlobe={setUseGlobe}
                    viewFlashback={viewFlashback} setViewFlashback={setViewFlashback}
                    activeBaseboard={activeBaseboard} setActiveBaseboard={setActiveBaseboard}
                    tool={tool} setTool={setTool}
                >

                </Overlay>
                <HiddenCanvas canvasRef={wikidataidCanvasRef} />
            </>
        );
}

/*
<Board
    tilesRgba={props.tilesRgba}
    tiles={props.tiles}
    map={props.map}
    values={props.values}
    width={props.width}
    mouseDown={props.mouseDown}
    brushColor={props.brushColor}

    setTile={props.setTile}
/>
*/

export default connect(
  mapStateToProps,
  // { getData },
  mapDispatchToProps
)(MainPage);
