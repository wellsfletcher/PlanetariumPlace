import * as React from 'react';
import PropTypes from 'prop-types';
import { rgbToHex, useTheme } from '@mui/material/styles';
import { withStyles } from 'tss-react/mui';
// import * as colors from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import Slider from '@mui/material/Slider';
import { capitalize } from '@mui/material/utils';

import { blue } from '@mui/material/colors';

// {{"demo": "pages/customization/color/ColorTool.js", "hideToolbar": true, "bg": true}}

const defaults = {
  primary: '#00D3DD',
};

const styles = (theme) => ({
  radio: {
    padding: 0,
  },
  radioIcon: {
    width: 48,
    height: 48,
  },
  radioIconSelected: {
    width: 48,
    height: 48,
    border: '1px solid white',
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatch: {
    width: 192,
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  slider: {
    width: 'calc(100% - 80px)',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  colorBar: {
    marginTop: theme.spacing(2),
  },
  colorSquare: {
    width: 64,
    height: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
});

// still need to create parameters for default color value...
function ColorTool(props) {
  const { colors, onChangeComplete, classes } = props; // colors, names
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

  const colorPicker = (intent) => {
    /*
    <Typography component="label" gutterBottom htmlFor={intent} variant="h6">
      {capitalize(intent)}
    </Typography>
    */

    return (
      <Grid item xs={12} sm={6} md={4}>
        <div className={classes.swatch}>
          {hues.map((hue) => {
            const backgroundColor = colors[hue];

            return (
              <Tooltip placement="right" title={hue} key={hue}>
                <Radio
                  className={classes.radio}
                  color="default"
                  checked={state[intent] === backgroundColor}
                  onChange={handleChangeHue(intent)}
                  value={hue}
                  name={intent}
                  aria-labelledby={`tooltip-${intent}-${hue}`}
                  icon={
                    <div className={classes.radioIcon} style={{ backgroundColor }} />
                  }
                  checkedIcon={
                    <div
                      className={classes.radioIconSelected}
                      style={{ backgroundColor }}
                    >
                      <CheckIcon style={{ fontSize: 30 }} />
                    </div>
                  }
                />
              </Tooltip>
            );
          })}
        </div>
      </Grid>
    );
  };

  return (
    <Grid container spacing={5} className={classes.root}>
      {colorPicker('primary')}
    </Grid>
  );
}

ColorTool.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(ColorTool, styles);
