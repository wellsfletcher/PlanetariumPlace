import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import CountrySearch from './CountrySearch';
import ColorPicker from './ColorPicker';
import VerticalColorPicker from './VerticalColorPicker';

import SearchIcon from '@material-ui/icons/Search';
import BrushIcon from '@material-ui/icons/Brush';
import PanToolIcon from '@material-ui/icons/PanTool';
import PaletteIcon from '@material-ui/icons/Palette';
import InfoIcon from '@material-ui/icons/Info';

const drawerWidth = 360; // 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    width: `calc(100% - ${theme.spacing(7) + 1}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth, // doesn't matter
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  appBarTitle: {
    marginLeft: 0,
  },
  iconList: {
    // position: "absolute",
    // top: 0, // theme.spacing(2),
    // left: 0, // theme.spacing(2),
    width: theme.spacing(7) + 1,
    // background: theme.palette.background.darkPaper,
    // position: "absolute",
    overflowX: 'hidden',
  },
  viewContent: {
      width: `calc(100% - ${theme.spacing(7) + 1}px)`,
      background: theme.palette.background.darkPaper,
  },
  floater: {
      position: "absolute",
  },
  icon: {
      // position: "fixed",
      width: theme.spacing(7) + 1, // aaaaaaaaaaaaaaaaaaaa // I hate CSS
  },
  gridContainer: { // nah
      width: theme.spacing(7) + 1,
  },
  fullWidth: {
      width: '100%',
      backgroundColor: theme.palette.background.darkPaper,
  },
  fullHeight: {
      height: `calc(100% - ${0}px)`
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    overflowX: 'hidden',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

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

export default function MiniDrawer(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [pageContents, setPageContents] = React.useState(<></>);
    const handleListItemClick = (event, index) => {
        var nextIndex = index;
        if (selectedIndex === index) {
            nextIndex = -1;
        } else {
            const nextPageContents = pageContentsMap.get(nextIndex);
            if (nextPageContents != null) {
                setPageContents(nextPageContents);
            }
        }
        setSelectedIndex(nextIndex);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    var pageContentsMap = new Map();
    pageContentsMap.set(0, <CountrySearch/>);
    pageContentsMap.set(1, null);
    pageContentsMap.set(2, null);
    pageContentsMap.set(3,
        <List>
            <ListItem key={"pallette-header"}>
                <ListItemIcon>
                    <PaletteIcon />
                </ListItemIcon>
                <ListItemText primary={"Paintbrush"} />
            </ListItem>
            <ListItem key={"hello"}>
                <ColorPicker
                    colors={colors}
                    onChangeComplete={props.onChangeComplete}
                />
            </ListItem>
        </List>
    );
    pageContentsMap.set(4,
        <List className={classes.fullWidth}>
            <ListItem key={"info-header"}>
                <ListItemIcon>
                    <InfoIcon />
                </ListItemIcon>
                <ListItemText primary={"Info"} />
            </ListItem>
            <ListItem key={"info-description-header"}>
                <ListItemText primary="Draw on a 3D globe with fellow internet users" />
            </ListItem>
            <ListItem>
                <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                </Typography>
            </ListItem>
        </List>
    );

    const handleAdvancedItemClick = (event, clickedItemIndex) => {

        (selectedIndex === clickedItemIndex || (open && pageContentsMap.get(selectedIndex) == null)) ? handleDrawerClose() : handleDrawerOpen();
        handleListItemClick(event, clickedItemIndex);
    };


  // color="transparent" elevation={0}
  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        color="transparent"
        elevation={0}
      >
        <Toolbar>
        {/*
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          */}
          <Typography variant="h6" noWrap>
            Planetarium.place
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        color="transparent"
        elevation={0}
      >


        <Grid container spacing={0}
            direction="row"
            justify="flex-start"
            alignItems="stretch"
            className={classes.drawerOpen + ' ' + classes.fullHeight}
        >
            <Grid item className={classes.iconList}>
            <List component="nav" aria-label="main mailbox folders" disablePadding={true}
                className={classes.floater}
            >
              <ListItem
                button
                selected={selectedIndex === 0}
                onClick={(event) => handleAdvancedItemClick(event, 0)}
                className={classes.icon}
              >
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                className={classes.icon}
              >
                <ListItemIcon>
                  <BrushIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
                className={classes.icon}
              >
                <ListItemIcon>
                  <PanToolIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 3}
                onClick={(event) => handleAdvancedItemClick(event, 3)}
                className={classes.icon}
              >
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 4}
                onClick={(event) => handleAdvancedItemClick(event, 4)}
                className={classes.icon}
              >
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
              </ListItem>
            </List>
            </Grid>


            <Grid item className={classes.viewContent}>
                <div>
                {pageContents}
                </div>
            </Grid>
        </Grid>



      </Drawer>

    </>
  );
}
