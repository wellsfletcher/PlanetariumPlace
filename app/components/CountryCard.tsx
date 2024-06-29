import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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

interface CountryCardProps {
    label: string,
    code: string,
    country: any, // TODO: define like a Country type
    activeCountry: string,
    setActiveCountry: (value: string) => void
}

export default function MediaCard(props: CountryCardProps) {
  const classes = useStyles();

  const flag = countryToFlag(props.code);
  // "https://en.wikipedia.org/w/index.php?search=" + props.label.replace(/ /g, '')

  let isActiveCountry = props.activeCountry == props.country.wikidataid;

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
            {props.label} has a gross domestic product of {parseInt(props.country.gdp_md).toLocaleString('en-US')}K and a population of about {parseInt(props.country.pop_est).toLocaleString('en-US')}.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => {
            // console.log("props = ");
            // console.log(props);
            // alert('clicked');
            // var nextCountry = props.label;
            let nextCountry = props.country.wikidataid;
            /*
            if (props.activeCountry === props.label) {
                nextCountry = "noCountrySelected";
            }
            */
            // to avoid using unnecessary rerenders, imma gonna try to move this logic to setActiveCountry maybe?
            // console.log(["nextCountry", nextCountry, "props.activeCountry", props.activeCountry]);
            if (isActiveCountry) {
                nextCountry = "";
            }
            props.setActiveCountry(nextCountry);
            }}>
          {isActiveCountry ? "Hide" : "Show"}
        </Button>
        <Button size="small" color="primary" target="_blank" href={"https://www.wikidata.org/wiki/" + props.country.wikidataid}>
          View Stats
        </Button>
      </CardActions>
    </Card>
  );
}
