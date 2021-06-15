import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from "react-redux";
import { setTile, setBrushColor, getData, fetchTiles, fetchTileChanges } from "../actions/index";
import { bindActionCreators } from 'redux';

import useInterval from './hooks/useInterval';

import Board from './Board';
import Globe from './Globe';
import PersistentDrawer from './PersistentDrawer';
import { hexcolor2int } from '../utils/general';

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
    // setBrushColor: (color) => dipatch(setBrushColor(color))
    // setBrushColor: bindActionCreators((color) => dipatch(setBrushColor(color)), dispatch) // no work
    // setBrushColor: bindActionCreators((color) => setBrushColor(color), dispatch) // works
    setBrushColor: bindActionCreators(setBrushColor, dispatch)
  };
}

const mapStateToProps = (state) => {
    return {
        // boardId: state.boardId,
        // lastUpdated: state.board.lastUpdated,
        // unplayedChanges: state.board.unplayedChanges,
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

        const TILE_UPDATE_FREQUENCY = 10000;
        // setInterval(() => {
        useInterval(() => {
            console.log("updating async tiles...");
            // props.fetchTileChanges(props.boardId, props.lastUpdated);
            // props.fetchTileChanges(1, new Date());
            // console.log(unplayedChanges);
        }, TILE_UPDATE_FREQUENCY);

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
