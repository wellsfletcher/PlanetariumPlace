import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from "react-redux";
import { setMouseDown } from "../actions/index";

import BoardPage from './BoardPage';

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import themeColor from '@material-ui/core/colors/indigo';

function mapDispatchToProps(dispatch) {
  return {
    setMouseDown: (mouseDown) => dispatch(setMouseDown(mouseDown))
  };
}

const theme = createMuiTheme({
    palette: {
        primary: themeColor,
        type: 'dark',
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    handleMouseDown() {
        this.props.setMouseDown(true);
        document.addEventListener("pointerup", this.handleMouseUp);
    }

    handleMouseUp() {
        this.props.setMouseDown(false);
        document.removeEventListener("mouseup", this.handleMouseDown);
    }

    render() {
        return (
            <div onPointerDown={this.handleMouseDown}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <BoardPage />
                </ThemeProvider>
            </div>
        );
    }
}

export default connect(
  null,
  mapDispatchToProps
)(App);
