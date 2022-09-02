import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    // background: theme.palette.background.darkPaper,
    whiteSpace: 'normal',
  },
  media: {
    height: 140,
  },
  darker: {
    // background: theme.palette.background.darkPaper
  },
}));

export default function MediaCard(props) {
  const classes = useStyles();

  const flag = countryToFlag(props.code);
  // "https://en.wikipedia.org/w/index.php?search=" + props.label.replace(/ /g, '')

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
            <Typography variant="h1" component="h1" align="center">
              {flag}
            </Typography>
        </CardContent>
        {/*
        <CardMedia
          className={classes.media}
          image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
          title={props.label}
        />
        */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.label}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.label} has a gross domestic product of {parseInt(props.country.gdp_md).toLocaleString('en-US')} and a population of about {parseInt(props.country.pop_est).toLocaleString('en-US')}.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => {
                var nextCountry = props.label;
                /*
                if (props.activeCountry === props.label) {
                    nextCountry = "noCountrySelected";
                }
                */
                props.setActiveCountry(nextCountry)
            }}>
          Show
        </Button>
        <Button size="small" color="primary" target="_blank" href={"https://www.wikidata.org/wiki/" + props.country.wikidataid}>
          Open Wiki
        </Button>
      </CardActions>
    </Card>
  );
}
