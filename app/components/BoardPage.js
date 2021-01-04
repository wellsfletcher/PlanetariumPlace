import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from "react-redux";
import { setTile, setBrushColor } from "../actions/index";
import { bindActionCreators } from 'redux';

import Board from './Board';
import Globe from './Globe';
import PersistentDrawer from './PersistentDrawer';
import { hexcolor2int } from '../utils/general';

import Fab from '@material-ui/core/Fab';
import GlobeIcon from '@material-ui/icons/Public';

function mapDispatchToProps(dispatch) {
  return {
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

        const onChangeComplete = (color) => {
            var brushColorInt = hexcolor2int(color);
            // alert("painting = " + brushColorInt);
            props.setBrushColor(brushColorInt);
        };

        // var tiles = [];
        const boardProps = {
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

        return (
            <>
                <div style={style}>
                    <PersistentDrawer
                        onChangeComplete={onChangeComplete}
                    />
                    {boardViewer}
                </div>
                <Fab
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
                </Fab>
            </>
        );
}

/*
<Board
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
  mapDispatchToProps
)(BoardPage);
