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
  },
  viewContent: {
      width: `calc(100% - ${theme.spacing(7) + 1}px)`,
  },
  gridContainer: { // nah
      width: theme.spacing(7) + 1,
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

export default function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleListItemClick = (event, index) => {
    var nextIndex = index;
    if (selectedIndex === index) {
        nextIndex = -1;
    }
    setSelectedIndex(nextIndex);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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
            <List component="nav" aria-label="main mailbox folders" disablePadding={true}>
              <ListItem
                button
                selected={selectedIndex === 0}
                onClick={(event) => {
                    (selectedIndex === 0 || (open && selectedIndex != 4)) ? handleDrawerClose() : handleDrawerOpen();
                    handleListItemClick(event, 0);
                }}
              >
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemIcon>
                  <BrushIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemIcon>
                  <PanToolIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem
                button
                selected={selectedIndex === 4}
                onClick={(event) => {
                    (selectedIndex === 4 || (open && selectedIndex != 0)) ? handleDrawerClose() : handleDrawerOpen();
                    handleListItemClick(event, 4);
                }}
              >
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
              </ListItem>
            </List>
            </Grid>


            <Grid item className={classes.viewContent}>
                <CountrySearch/>
            </Grid>
        </Grid>



      </Drawer>

    </>
  );
}
