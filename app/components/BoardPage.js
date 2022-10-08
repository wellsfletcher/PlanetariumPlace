import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';

import { connect } from "react-redux";
import { fetchTiles, fetchTileChanges} from "../actions/index"; // these should get moved
import { actions } from "../reducers/index";
import { bindActionCreators } from 'redux';

import { useInterval } from './hooks/useInterval';
import { useTimeout } from './hooks/useTimeout';

import Board from './Board';
import Globe from './Globe';
import PersistentSearchDrawer from './PersistentSearchDrawer';
import TabBar from './TabBar';
import VerticalColorPicker from './VerticalColorPicker';
import Overlay from './Overlay';
import { hexcolor2int } from '../utils/general';
import * as Time from '../utils/time';
import * as System from '../constants/system';
// import * as Board from '../modules/board';
// import useWindowDimensions from './useWindowDimensions';

import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';
/*
import GlobeIcon from '@material-ui/icons/Public';
import MapIcon from '@material-ui/icons/Map';
import ViewIcon from '@material-ui/icons/History'; // Visibility, HourglassFullTwoTone, History
import ViewOffIcon from '@material-ui/icons/FastForward'; // VisibilityOff, HourglassEmpty, Update, FastForward
import AddIcon from '@material-ui/icons/Add';
*/

function mapDispatchToProps(dispatch) {
  return {
    //- getData: () => getData()(dispatch), //  cursed
    // getData: () => getData(dispatch),
    fetchTiles: () => fetchTiles()(dispatch),
    fetchTileChanges: (lastUpdated, boardId) => fetchTileChanges()(lastUpdated, boardId, dispatch),
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

// export default class BoardPage extends React.Component {
const BoardPage = (props) => {
    // console.log("something is happening right now");
    const tiles = useSelector(state => {
        // console.log(state);
        // console.log(state.board);
        return state.board.tiles;
    });
    const tilesRgba = useSelector(state => state.board.tilesRgba);
    const map = useSelector(state => state.board.map);
    const values = useSelector(state => state.board.values);
    const width = useSelector(state => state.board.width);
    const activeCountry = useSelector(state => state.board.activeCountry);
    const brushColor = useSelector(state => state.brushColor);

    // console.log(process.env.NODE_ENV);
    // console.log(tiles);

    props = { tiles, tilesRgba, map, values, width, activeCountry, brushColor, ...props };
    // console.log("cool beans");

        const style = { // may wanna move this elsewhere and delet the div
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

        // useInterval(() => {
        //     console.log("updating async tiles...");
        //     const placeholderDate = new Date();
        //     props.fetchTileChanges(props.boardId, placeholderDate);
        //     // props.fetchTileChanges(props.boardId, props.lastUpdated);
        //     // props.fetchTileChanges(1, new Date());
        //
        //     // play a bunch of actions after some time (the delay is stored in the payload)
        //     // this shit needs to get run after tile changes have been fetched
        //     /*
        //     console.log(props.unplayedChanges);
        //     while (!props.unplayedChanges.isEmpty()) {
        //         let change = props.unplayedChanges.dequeue();
        //         console.log(change);
        //         props.playChange(change);
        //     }
        //     */
        // }, TILE_UPDATE_FREQUENCY);

        const onChangeComplete = (color) => {
            var brushColorInt = hexcolor2int(color);
            // alert("painting = " + brushColorInt);
            props.setBrushColor(brushColorInt);
        };

        const [viewFlashback, setViewFlashback] = React.useState(false);
        const [tool, setTool] = React.useState(0);

        // var tiles = [];
        const boardProps = {
            tilesRgba: props.tilesRgba,
            tiles: props.tiles,
            map: props.map,
            values: props.values,
            width: props.width,
            // mouseDown: props.mouseDown,
            brushColor: props.brushColor,
            activeCountry: props.activeCountry,
            viewFlashback: viewFlashback,
            setViewFlashback: setViewFlashback,

            setTile: props.setTile
        }

        const NUM_BOARD_IDS = 2;

        const [useGlobe, setUseGlobe] = React.useState(true);
        const boardViewer = (!useGlobe) ?
            <Board
                {...boardProps}
            /*{mouseDown={props.mouseDown}*/
            />
            :
            <Globe
                {...boardProps}
            />
        ;

        return (
            <>
                <div style={style}>
                    <PersistentSearchDrawer
                        onChangeComplete={onChangeComplete}
                        activeCountry={activeCountry}
                        setActiveCountry={props.setActiveCountry}
                    >
                    </PersistentSearchDrawer>
                    {boardViewer}
                </div>
                <Overlay
                    onChangeComplete={onChangeComplete}
                    useGlobe={useGlobe} setUseGlobe={setUseGlobe}
                    viewFlashback={viewFlashback} setViewFlashback={setViewFlashback}
                    tool={tool} setTool={setTool}
                >

                </Overlay>
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
)(BoardPage);
