import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from "react-redux";
// Commented out bc of TS bug
// import { setMouseDown } from "../actions/index";
// import { } from "../actions/index";
import { actions } from "../reducers/index";

import BoardPage from './BoardPage';

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import themeColor from '@material-ui/core/colors/indigo';

// console.log("setMouseDown = ");
// console.log(setMouseDown);

// setMouseDown = undefined;

function mapDispatchToProps(dispatch) {
  return {
    setMouseDown: (mouseDown) => dispatch(actions.setMouseDown(mouseDown)) // might not be doing correctly
  };
}

// declare module '@material-ui/core/styles' { // @material-ui/core/styles
//     interface TypeBackground {
//         darkPaper: string;
//         lightPaper?: string;
//     }
// }

//-
// declare module '@material-ui/core/styles' {
//     interface Theme {
//         paletteBackground: {
//             darkPaper: string;
//             lightPaper: string;
//         };
//     }
//     // allow configuration using `createTheme`
//     interface ThemeOptions {
//         paletteBackground?: {
//             darkPaper?: string;
//             lightPaper?: string;
//         };
//     }
// }

const theme = createMuiTheme({
    paletteBackground: {
        darkPaper: "#303030",
        lightPaper: "#424242"
    },
    palette: {
        primary: {
            light: "#7FBDF8", // adfsaf
            main: "#7FBDF8", // #6EADF7, #7FBDF8
            dark: "#7FBDF8",
            contrastText: "#fff"
        },
        // customBackground: {
        //     darkPaper: "#303030",
        //     lightPaper: "#424242"
        // },
        // primary: themeColor,
        // primary: "#90caf9", // palette.primary.main
        type: 'dark',
        background: {
            default: "#00000E",
            // paper: "#424242",
            // Commented out because of TS bug
            // darkPaper: "#303030", // "#424242"
            // Commented out because of TS bug
            // lightPaper: "#424242", // "#424242"
        },
        /*
        action: {
            active: "#fff"
        }
        */
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    handleMouseDown() {
        //- this.props.setMouseDown(true);
        //- document.addEventListener("pointerup", this.handleMouseUp);
    }

    handleMouseUp() {
        //- this.props.setMouseDown(false);
        //- document.removeEventListener("mouseup", this.handleMouseDown);
    }

    render() {
        return (
            <div>
            {/*<div onPointerDown={this.handleMouseDown}>*/}
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
