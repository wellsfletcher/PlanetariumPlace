import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import PanToolIcon from '@mui/icons-material/PanTool';
import PaletteIcon from '@mui/icons-material/Palette';
import BrushIcon from '@mui/icons-material/Brush';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    style: {
        height: "100px"
    }
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 500,
    // height: "100%",
    // width: 200
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /*
  <TabPanel value={0} index={0}>
    {props.children}
  </TabPanel>
  */

  return (
    <div className={classes.root}
    style={{
        position: 'absolute',
        top: "0px", // theme.spacing(2),
        left: "0px", // theme.spacing(2),
        // height: "50px"
    }}>
      <Tabs
        orientation="vertical"
        variant="standard"
        centered
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        style={{
            position: 'absolute',
            top: "0px", // theme.spacing(2),
            left: "0px", // theme.spacing(2),
        }}
      >
        <Tab icon={<SearchIcon />} {...a11yProps(0)} />
        <Tab icon={<BrushIcon />} {...a11yProps(1)} />
        <Tab icon={<PanToolIcon />} {...a11yProps(2)} />
        <Tab icon={<PaletteIcon />} {...a11yProps(3)} />
        <Tab icon={<InfoIcon />} {...a11yProps(4)} />
      </Tabs>
      <TabPanel value={0} index={0}>
      </TabPanel>
    </div>
  );
}
