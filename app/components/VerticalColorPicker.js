import * as React from 'react';
import PropTypes from 'prop-types';
import { rgbToHex, withStyles, useTheme } from '@material-ui/core/styles';
// import * as colors from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import Slider from '@material-ui/core/Slider';
import { capitalize } from '@material-ui/core/utils';

import blue from '@material-ui/core/colors/blue';
import useWindowDimensions from './useWindowDimensions';

// {{"demo": "pages/customization/color/ColorTool.js", "hideToolbar": true, "bg": true}}

const defaults = {
  primary: '#00D3DD',
};

const styles = (theme) => ({
  radio: {
    padding: 0,
  },
  verticalSize: {
      width: 48,
      height: "6.25vh",
      // height: 48
  },
  horizontalSize: {
      width: "6.25vw",
      height: 48,
  },
  radioIcon: {
    // width: "6.25vw",
    // height: 48,
  },
  radioIconSelected: {
    // width: "6.25vw",
    // height: 48,
    border: '1px solid white',
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const defaultColors = {
          "white": "#FFFFFF",
          "lightGray": "#E4E4E4",
          "gray": "#888888",
          "black": "#1B1B1B",
          "pink": "#FFA7D1",
          "red": "#E50000",
          "orange": "#E59500",
          "brown": "#A06A42",
          "yellow": "#E5D900",
          "lightGreen": "#94E044",
          "green": "#02BE01",
          "cyan": "#00D3DD",
          "blue": "#0083C7",
          "indigo": "#0000EA",
          "magenta": "#CF6EE4",
          "purple": "#820080"
      };

// still need to create parameters for default color value...
function ColorTool(props) {
  const { onChangeComplete, classes } = props; // colors, names
  var colors = props.colors;
  if (colors == null) {
      colors = defaultColors;
  }
  const theme = useTheme();
  const [state, setState] = React.useState({
    primary: defaults.primary, // the actual selected color
    primaryHue: 'blue',
  });

  const hues = Object.keys(colors).slice(0, 16); // const hues = names;

  const handleChangeHue = (name) => (event) => {
    const hue = event.target.value; // hue corresponds to the name of the color
    const color = colors[hue];

    onChangeComplete(color);

    setState({
      ...state,
      [`${name}Hue`]: hue,
      [name]: color,
    });
  };

  const { isLandscape } = useWindowDimensions();
  const alignVertical = (props.vertical == null) ? false : props.vertical;
  // const alignVertical = isLandscape;
  // const alignVertical = true;

  const size = (alignVertical) ? classes.verticalSize : classes.horizontalSize;

  const colorPicker = (intent) => {
      return (<>
            {hues.map((hue, k) => {
              const backgroundColor = colors[hue];

              return (
                <Grid item key={"color-picker-item-" + k}>
                <Tooltip placement="right" title={hue} key={hue}>
                  <Radio
                    className={classes.radio + " " + size}
                    color="default"
                    checked={state[intent] === backgroundColor}
                    onChange={handleChangeHue(intent)}
                    value={hue}
                    name={intent}
                    aria-labelledby={`tooltip-${intent}-${hue}`}
                    icon={
                      <div className={classes.radioIcon + " " + size} style={{ backgroundColor }} />
                    }
                    checkedIcon={
                      <div
                        className={classes.radioIconSelected + " " + size}
                        style={{ backgroundColor }}
                      >
                        <CheckIcon style={{ fontSize: 30 }} />
                      </div>
                    }
                  />
                </Tooltip>
                </Grid>
              );
            })}
        </>
    );
  };

    /*
    const picker = (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-end"
            className={classes.root}
        >
            {colorPicker('primary')}
        </Grid>
    );
    */
    const picker = (alignVertical) ?
        <Grid
            container
            direction="column"
            justify="flex-end"
            alignItems="flex-end"
            wrap="nowrap"
        >
            {colorPicker('primary')}
        </Grid>
    :
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-end"
            wrap="nowrap"
        >
            {colorPicker('primary')}
        </Grid>;

    return picker;
    /*
    return (
        (alignVertical) ?
            <div
                style={{
                    position: 'fixed',
                    top: "0px", // theme.spacing(2),
                    right: "0px", // theme.spacing(2),
                    width: "48px",
                    height: "100vw"
                }}
            >
                {picker}
            </div>
        :
            <div
                style={{
                    position: 'fixed',
                    bottom: "0px", // theme.spacing(2),
                    left: "0px", // theme.spacing(2),
                    width: "100vw",
                    height: "48px"
                }}
            >
                {picker}
            </div>

    );
    */
}

ColorTool.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ColorTool);
