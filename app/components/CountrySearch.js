import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import SearchBar from './SearchBar';
import CountryCard from './CountryCard';
// import { countries } from '../constants/countries';

var Infinite = require('react-infinite');

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.darkPaper,
  },
}));

/**
 * Search menu for countries
 * @param {*} props {containerHeight, setActiveCountry, activeCountry}
 */
export default function CountrySearch(props) {
    const materialProps = props;
    const classes = useStyles();

    /*
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);
    // const containerHeight = containerRef.current.clientHeight;
    useEffect(() => {
        setContainerHeight(containerRef.current.clientHeight);
    }, []);

    console.log("containerHeight = " + containerHeight);
    */
    const containerHeight = props.containerHeight;
    console.log("containerHeight = " + containerHeight);

    const [filtered, setFiltered] = useState([]);

    const [countries, setCountries] = React.useState([]); // React.useState({ features: []});
    React.useEffect(() => {
        const url = "https://planetarium.place/api/v0/country/properties.php";
        // load data
        // fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);

        // fetch(url).then(res => res.json()).then(setCountries);
        fetch(url).then(res => res.json()).then(res => {
            setCountries(res);
            setFiltered(res);
        });
        // .then(() => {console.log(countries); setFiltered([{"name_long":"Antarctica","adm0_a3":"ATA","wikidataid":"Q51","pop_est":"4490","gdp_md":"898.00","price":"543.652532134"}])});
        // .then(() => {console.log(countries); setFiltered(countries)});
        // .then(onChange(null));
        // .then(setFiltered(countries.filter((data) => filter(data, ""))));
        // fetch(url).then(res => {console.log(res); return res.json();}).then(setCountries);
        // fetch(url).then(res => res.json()).then(setFiltered);
    }, []);

    const filter = (data, queryString) => {
        /*
        if (data.suggested == true && (queryString == null
            || data.label.toLowerCase().includes(queryString))) {
                return data;
            }
            */
        // console.log(data);
        if (data.name_long.toLowerCase().includes(queryString)) {
            return data;
        }
        /*
        if (data.label.toLowerCase().includes(queryString)) {
            return data;
        }
        */
    };

    // const [filtered, setFiltered] = useState(countries.filter((data) => filter(data, "")));
    console.count('counter');


    var onChange = (event) => {
        if (event == null) {
            // setFiltered(countries);
        }
        var queryString = event.target.value;
        // what the heck is this little chunk
        if (queryString == null) {
            if (data.suggested == true) {
                return data;
            }
        }
        queryString = queryString.toLowerCase();
        //- var queryString = event.target.value.toLowerCase();
        // console.log("queryString = " + queryString);
        // const newFilterCountries = countries.filter(filter);
        /*
        const newFilterCountries = countries.filter((data) => {

            if (data.suggested == true && (queryString == null
                || data.label.toLowerCase().includes(queryString))) {
                    return data;
                }

            if (data.suggested == true && data.label.toLowerCase().includes(queryString)) {
                return data;
            }
        });
        */
        const comparator = (a, b) => {
            // give priority to countries that start with query string
            const aStartsWithQS = a.name_long.toLowerCase().startsWith(queryString);
            const bStartsWithQS = b.name_long.toLowerCase().startsWith(queryString);
            // const comparison = a.label.localeCompare(b.label);
            if (aStartsWithQS && bStartsWithQS || (!aStartsWithQS && !aStartsWithQS)) { // || (!aStartsWithQS && !aStartsWithQS)
                return a.name_long.localeCompare(b.name_long);
            } else if (aStartsWithQS) {
                return -1;
            } else if (bStartsWithQS) {
                return 1;
            }
        };

        const newFilterCountries = countries.filter((data) => filter(data, queryString)); // .sort(comparator);
        setFiltered(newFilterCountries);
    };

    // 318.71
    // 16 total padding around list, 35 search bar height, 16 padding around search bar
  return (
    <>
        <List className={classes.root}>
            <ListItem>
              <SearchBar onChange={onChange}/>
            </ListItem>

            <Infinite containerHeight={containerHeight - 16 - 35 - 16} elementHeight={302.707}>
            {filtered.map((country) => (
                <ListItem key={`country-${country.name_long}-${country.adm0_a3}`}>
                    <CountryCard
                        label={country.name_long}
                        code={country.iso_a2}
                        country={country}
                        activeCountry={props.activeCountry}
                        setActiveCountry={props.setActiveCountry}
                    />
                </ListItem>
            ))}
            </Infinite>
        </List>
        </>
  );
}
