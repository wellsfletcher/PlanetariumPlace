import React from 'react';
import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PaletteIcon from '@mui/icons-material/Palette';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import ColorPicker from './ColorPicker';
import VerticalColorPicker from './VerticalColorPicker';
import CountrySearch from './CountrySearch';
import useWindowDimensions from './hooks/useWindowDimensions';

const drawerWidth = 320;

// color="inherit"
// color: "inherit"
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  palette: {
      mode: 'dark',
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
      // TS bug
      // background: theme.palette.background.darkPaper,
      background: theme.paletteBackground.darkPaper,
      // background: undefined
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

interface PersistentDrawerProps {
    onChangeComplete: (color: any) => void,
    activeCountry: string,
    setActiveCountry: (value: string) => void
}

export default function PersistentDrawer(props: PersistentDrawerProps) {
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

  return <>
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
          size="large">
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
        <IconButton onClick={handleDrawerClose} size="large">
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
  </>;
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
