import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';

import { connect } from "react-redux";
import { setTile, setLocalTile, setBrushColor, getData, fetchTiles, fetchTileChanges, playChange } from "../actions/index";
import { bindActionCreators } from 'redux';

import { useInterval } from './hooks/useInterval';
import { useTimeout } from './hooks/useTimeout';

import Board from './Board';
import Globe from './Globe';
import PersistentDrawer from './PersistentDrawer';
import { hexcolor2int } from '../utils/general';
import * as Time from '../utils/time';
import * as System from '../constants/system';
// import * as Board from '../modules/board';

import Fab from '@material-ui/core/Fab';
import GlobeIcon from '@material-ui/icons/Public';
import ViewIcon from '@material-ui/icons/Visibility'; // VisibilityOff

function mapDispatchToProps(dispatch) {
  return {
    //- getData: () => getData()(dispatch), //  cursed
    // getData: () => getData(dispatch),
    fetchTiles: () => fetchTiles()(dispatch),
    fetchTileChanges: (lastUpdated, boardId) => fetchTileChanges()(lastUpdated, boardId, dispatch),
    // fetchTileChanges: bindActionCreators(({x, y}, color) => setTile({x, y, color}), dispatch),
    // setTile: ({x, y}, color) => dispatch(setTile({x, y, color})),
    setTile: bindActionCreators(({x, y}, color) => setTile({x, y, color}), dispatch),
    setLocalTile: bindActionCreators((index, color) => setLocalTile({index, color}), dispatch),
    playChange: bindActionCreators((change) => playChange({change}), dispatch),
    // setBrushColor: (color) => dipatch(setBrushColor(color))
    // setBrushColor: bindActionCreators((color) => dipatch(setBrushColor(color)), dispatch) // no work
    // setBrushColor: bindActionCreators((color) => setBrushColor(color), dispatch) // works
    setBrushColor: bindActionCreators(setBrushColor, dispatch)
  };
}

const mapStateToProps = (state) => {
    return {
        boardId: state.boardId,
        lastUpdated: state.board.lastUpdated,
        unplayedChanges: state.board.unplayedChanges,
        // articles: state.articles,
        // remoteTiles: state.remoteTiles,
        tilesRgba: state.board.tilesRgba,
        tiles: state.board.tiles,
        map: state.board.map,
        values: state.board.values,
        width: state.board.width,
        mouseDown: state.mouseDown,
        brushColor: state.brushColor
    };
};

// export default class BoardPage extends React.Component {
const BoardPage = (props) => {
        const style = { // may wanna move this elsewhere and delet the div
            position: "absolute",
            width: "100%",
            height: "100%"
        };

        React.useEffect(() => {
            props.fetchTiles();
            // props.getData();
            // alert("doing something");
        }, []);
        // console.log(props.remoteTiles);

        const TILE_UPDATE_FREQUENCY = System.TILE_UPDATE_FREQUENCY;
        const TILE_UPDATE_OFFSET = System.TILE_UPDATE_OFFSET;
        // setInterval(() => {
        useInterval(() => {
            console.log("updating async tiles...");
            props.fetchTileChanges(props.boardId, props.lastUpdated);
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

        // put scheduler hook here? or maybe just do it all async elsewhere
        // could also use useInterval here
        /*
        const [changeDelay, setChangeDelay] = useState(null);
        useTimeout(() => {
        // useInterval(() => {
            console.log("playing async tile...");
            var nextDelay = null;

            // dequeue current unplayed change
            const change = props.unplayedChanges.dequeue();
            if (nextChange == undefined) {
                setChangeDelay(nextDelay); return;
            }
            const {index, color, timestamp} = change;
            // set the tile using that unplayed change
            props.setLocalTile(index, color);
            // peek at the next unplayed change to get the delay until it
            const nextChange = props.unplayedChanges.peek();
            if (nextChange == undefined) {
                setChangeDelay(nextDelay); return;
            }
            nextDelay = Time.getRemaining(Time.addMillis(Time.str2date(nextChange.timestamp), TILE_UPDATE_OFFSET));
            // set another timeout with that delay
            setChangeDelay(nextDelay);
        // }, changeDelay);
        }, changeDelay, props.unplayedChanges.queue);
        // }, changeDelay, props.unplayedChanges);
        */
        /*
        // needs to get called again whenever props.unplayedChanges.queue changes
        useTimeout(() => {
            props.playNextChange();
            // can set delay state here or in above method
            // if the delay is null, it should not schelue a timeout
            // (or if the queue is empty)
        }, changeDelay, props.unplayedChanges.queue);
        */


        const onChangeComplete = (color) => {
            var brushColorInt = hexcolor2int(color);
            // alert("painting = " + brushColorInt);
            props.setBrushColor(brushColorInt);
        };

        // var tiles = [];
        const boardProps = {
            tilesRgba: props.tilesRgba,
            tiles: props.tiles,
            map: props.map,
            values: props.values,
            width: props.width,
            // mouseDown: props.mouseDown,
            brushColor: props.brushColor,

            setTile: props.setTile
        }

        // var useGlobe = false;
        const [useGlobe, setUseGlobe] = React.useState(true);
        const boardViewer = (!useGlobe) ?
            <Board
                {...boardProps}
                mouseDown={props.mouseDown}
            />
            :
            <Globe
                {...boardProps}
            />
        ;
        /*
        // var boardStyle = (!useGlobe) ? {} : {display: "none"};
        var boardStyle = {};
        var board = (
            <Board
                {...boardProps}
                mouseDown={props.mouseDown}
                style={boardStyle}
            />
        );
        var globe = (!useGlobe) ?
            <> </>
            :
            <Globe
                {...boardProps}

            />
        ;
        // {board}
        // {globe}
        */


        const globeFab = <Fab
            color="primary"
            aria-label="view"
            style={{
                position: 'absolute',
                bottom: "5px", // theme.spacing(2),
                right: "5px" // theme.spacing(2),
            }}
            onClick={() => setUseGlobe(!useGlobe)}
         >
            <GlobeIcon />
        </Fab>;
        /*
        const globeFab = <Fab
            color="primary"
            aria-label="view"
            style={{
                margin: "7px"
            }}
            onClick={() => setUseGlobe(!useGlobe)}
         >
            <GlobeIcon />
        </Fab>;

        const flashbackFab = <Fab
            color="primary"
            aria-label="view"
            style={{
                margin: "7px"
            }}

            onClick={() => setUseGlobe(!useGlobe)}
         >
            <ViewIcon />
        </Fab>;

        const fabView = (
            <div
                style={{
                    width: "45px",
                    position: 'absolute',
                    bottom: "10px", // theme.spacing(2),
                    right: "10px", // theme.spacing(2),
                    // padding: "20px"
                    margin: "10px"
                }}
            >
                {flashbackFab}
                {globeFab}
            </div>
        );
        */

        return (
            <>
                <div style={style}>
                    <PersistentDrawer
                        onChangeComplete={onChangeComplete}
                    />
                    {boardViewer}
                </div>
                {globeFab}
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
