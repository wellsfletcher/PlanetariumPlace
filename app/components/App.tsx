import React from 'react';
import ReactDOM from 'react-dom';
//- import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; // Switch isn't a thing anymore apparently
import {connect, ConnectedProps} from "react-redux";
// Commented out bc of TS bug
//- import { setMouseDown } from "../actions";
// import { } from "../actions/index";
import {actions, BaseState} from "../reducers";

import BoardPage from './BoardPage';

import CssBaseline from "@material-ui/core/CssBaseline";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import themeColor from '@material-ui/core/colors/indigo';
import * as System from "../constants/system";

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

declare module '@material-ui/core/styles' {
    interface Theme {
        paletteBackground: {
            darkPaper: string;
            lightPaper: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        paletteBackground?: {
            darkPaper?: string;
            lightPaper?: string;
        };
    }
}

const theme = createTheme({
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

// const initialState: State = {
//     articles: [], // remove this
//     mouseDown: false, // not used
//     boardId: System.INITIAL_BOARD_ID,
//     // remoteTiles: null,
//     board: {
//         lastUpdated: new Date(),
//         // unplayedChanges: [],
//         //- unplayedChanges: new Queue(), // not used
//
//         tilesRgba: new Uint8ClampedArray(new ArrayBuffer(System.INITIAL_WIDTH * System.INITIAL_HEIGHT * 4)),
//         tiles: [],
//         // links: initLinks, // maps pixel to relative url string
//         map: [], // new Map(), // initMap(), // not used anymore I think
//         values: ["", "canada", "usa", "mexico", "brazil"], // features // also not used
//         activeCountry: "",
//         width: System.INITIAL_WIDTH
//     },
//     brushColor: System.INITIAL_BRUSH_COLOR
// };

class App extends React.Component {
    constructor(props: any) {
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


// const mapStateToProps = (state: any) => ({
//     brushColor: state.brushColor,
//     values: state.values,
//     tilesRgba: state.tilesRgba,
//     tiles: state.tiles,
//     map: state.map,
//     activeCountry: state.activeCountry,
//     width: state.width,
//     viewFlashback: state.viewFlashback,
//     setViewFlashback: state.setViewFlashback,
// });

export default connect(
  null,
  mapDispatchToProps
)(App);

// export default connect(
//     mapStateToProps,
//   null
// )(App);

// export default App;

// const connector = connect(null, mapDispatchToProps);
// type PropsFromRedux = ConnectedProps<typeof connector>;
// export default connector(App);