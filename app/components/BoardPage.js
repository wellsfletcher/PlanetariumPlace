import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from "react-redux";
import { setTile, setBrushColor } from "../actions/index";
import { bindActionCreators } from 'redux';

import Board from './Board';
import Form from './Form';
import PersistentDrawer from './PersistentDrawer';
import { hexcolor2int } from '../utils/general';


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
        return (
            <>
                <div style={style}>
                    <PersistentDrawer
                        onChangeComplete={onChangeComplete}
                    />
                    <Board
                        tiles={props.tiles}
                        map={props.map}
                        values={props.values}
                        width={props.width}
                        mouseDown={props.mouseDown}
                        brushColor={props.brushColor}

                        setTile={props.setTile}
                    />
                </div>
            </>
        );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardPage);
