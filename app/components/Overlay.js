import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import RedditIcon from '@material-ui/icons/Reddit';
import GithubIcon from '@material-ui/icons/Github';

import GlobeIcon from '@material-ui/icons/Public';
import MapIcon from '@material-ui/icons/Map';
import ViewIcon from '@material-ui/icons/GridOff'; // History, Visibility, HourglassFullTwoTone, History
import ViewOffIcon from '@material-ui/icons/GridOn'; // FastForward, VisibilityOff, HourglassEmpty, Update, FastForward
import AddIcon from '@material-ui/icons/Add';

import BrushIcon from '@material-ui/icons/Brush';
import PanToolIcon from '@material-ui/icons/PanTool';
import PaletteIcon from '@material-ui/icons/Palette';
import ColorizeIcon from '@material-ui/icons/Colorize';

import VerticalColorPicker from './VerticalColorPicker';
import useWindowDimensions from './useWindowDimensions';




const useStyles = makeStyles((theme) => ({
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        // height: "100vh",
        // width: "100vw",
        pointerEvents: "none",
        display: "flex",
        "& > *": {
            pointerEvents: "auto",
        }
    },
    passThrough: {
        pointerEvents: "none",
        "& > *": {
            pointerEvents: "auto",
        }
    }
}));

export default function Overlay(props) {
    const classes = useStyles();
    const {children, onChangeComplete,
        useGlobe, setUseGlobe,
        viewFlashback, setViewFlashback,
        tool, setTool,
        ...rest} = props; // {...rest}
    // const style = {};

    const { isLandscape } = useWindowDimensions();

    const verticalAlignment = {
        direction: "row",
        justify: "flex-end",
        alignItems: "flex-end",
    };

    const horizontalAlignment = {
        direction: "column",
        justify: "flex-end",
        alignItems: "flex-end",
    };

    const alignment = (isLandscape) ? verticalAlignment : horizontalAlignment;

    const globeFab = <ToggleButtonGroup
        orientation="horizontal"
        color="primary"
        aria-label="view"
        style={{
            // marginBottom: "0px"
        }}
     >
        <ToggleButton selected={useGlobe} onClick={() => setUseGlobe(true)}>
            <GlobeIcon />
        </ToggleButton>
        <ToggleButton selected={!useGlobe} onClick={() => setUseGlobe(false)}>
            <MapIcon />
        </ToggleButton>
    </ToggleButtonGroup>;

    const flashbackFab = <ToggleButtonGroup
        orientation="horizontal"
        color="primary"
        aria-label="view"
        style={{
            // marginBottom: "14px"
        }}
     >
        <ToggleButton selected={viewFlashback} onClick={() => setViewFlashback(true)}>
            <ViewIcon />
        </ToggleButton>
        <ToggleButton selected={!viewFlashback} onClick={() => setViewFlashback(false)}>
            <ViewOffIcon />
        </ToggleButton>
    </ToggleButtonGroup>;

    const toolFab = <ToggleButtonGroup
        orientation="horizontal"
        color="primary"
        aria-label="view"
        style={{
            // marginBottom: "14px"
        }}
     >
        <ToggleButton selected={tool == 0} onClick={() => setTool(0)}>
            <BrushIcon />
        </ToggleButton>
        <ToggleButton selected={tool == 1} onClick={() => setTool(1)}>
            <PanToolIcon />
        </ToggleButton>
        <ToggleButton selected={tool == 2} onClick={() => setTool(2)}>
            <ColorizeIcon />
        </ToggleButton>
    </ToggleButtonGroup>;

    /*
    const boardIdFab = <Fab
        color="primary"
        aria-label="view"
        style={{
            margin: "7px"
        }}

        onClick={() => props.setBoardId(1 + (props.boardId % NUM_BOARD_IDS))}
     >
        <AddIcon />
    </Fab>;
    */

    /*
            <Grid item>
                <IconButton target="_blank" href="github.com/wellsfletcher/planetariumplace">
                    <GithubIcon/>
                </IconButton>
            </Grid>
    */

    // set the spacing property?
    const fabView = (
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"

          style={{
              // position: 'absolute',
              // bottom: "64px", // theme.spacing(2),
              // right: "64px", // theme.spacing(2),
              // height: "70px"
              padding: 24,
              gap: 24
          }}
        >
            <Grid item>
                <IconButton target="_blank" href="https://reddit.com/r/planetariumplace">
                    <RedditIcon/>
                </IconButton>
            </Grid>

            <Grid item>
                {flashbackFab}
            </Grid>
            <Grid item>
                {globeFab}
            </Grid>
        </Grid>
    );

    return (
        <Grid container className={classes.overlay} {...alignment} {...rest}>
            <Grid item>
                {fabView}
            </Grid>
            <Grid item>
                <VerticalColorPicker vertical={isLandscape} onChangeComplete={onChangeComplete} />
            </Grid>
        </Grid>
    );
}
