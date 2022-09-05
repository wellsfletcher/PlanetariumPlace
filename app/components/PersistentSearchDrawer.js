import React from 'react';
import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PaletteIcon from '@material-ui/icons/Palette';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import ColorPicker from './ColorPicker';
import VerticalColorPicker from './VerticalColorPicker';
import CountrySearch from './CountrySearch';
import useWindowDimensions from './useWindowDimensions';

const drawerWidth = 320;

// color="inherit"
// color: "inherit"
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  palette: {
      type: 'dark',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.background.darkPaper,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  passPassThrough: {
      pointerEvents: "none",
      "& > *": {
          "& > *": {
              pointerEvents: "auto",
          }
      }
  }
}));

/**
 * Sidebar drawer used in the app
*/
export default function PersistentDrawer(props) { // technically it doesn't use a lot of the props it is given
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const { windowHeight, windowWidth } = useWindowDimensions();
  /*
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(69);
  // const containerHeight = containerRef.current.clientHeight;
  useEffect(() => {
      setContainerHeight(containerRef.current.clientHeight);
  }, [windowHeight]);
  console.log("containerHeight = " + containerHeight);
  */

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const colors = {
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
  /*
  const onChangeComplete = (color) => {
      //
  }
  */
  const onChangeComplete = props.onChangeComplete;

  /*
  <ListSubheader key={"palletteheader"}>
      {"Palette"}
  </ListSubheader>
  */

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
      }) + " " + classes.passPassThrough}
        color="transparent" elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Planetarium.place
          </Typography>
        </Toolbar>
      </AppBar>



      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />


        <CountrySearch
            containerHeight={windowHeight - 64 - 1}
            activeCountry={props.activeCountry}
            setActiveCountry={props.setActiveCountry}
        />


      </Drawer>
    </>
  );
  //       <VerticalColorPicker colors={colors} onChangeComplete={onChangeComplete} />

}

/*
{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
  <ListItem button key={text}>
    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
))}
</List>
<Divider />
<List>
{['All mail', 'Trash', 'Spam'].map((text, index) => (
  <ListItem button key={text}>
    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
))}
</List>
*/
