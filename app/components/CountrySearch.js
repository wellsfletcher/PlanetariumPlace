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
import { countries } from '../constants/countries';

var Infinite = require('react-infinite');

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.darkPaper,
  },
}));


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

    const filter = (data, queryString) => {
        /*
        if (data.suggested == true && (queryString == null
            || data.label.toLowerCase().includes(queryString))) {
                return data;
            }
            */
        if (data.label.toLowerCase().includes(queryString)) {
            return data;
        }
    };

    const [filtered, setFiltered] = useState(countries.filter((data) => filter(data, "")));
    console.count('counter');


    const onChange = (event) => {
        var queryString = event.target.value;
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
            const aStartsWithQS = a.label.toLowerCase().startsWith(queryString);
            const bStartsWithQS = b.label.toLowerCase().startsWith(queryString);
            // const comparison = a.label.localeCompare(b.label);
            if (aStartsWithQS && bStartsWithQS || (!aStartsWithQS && !aStartsWithQS)) { // || (!aStartsWithQS && !aStartsWithQS)
                return a.label.localeCompare(b.label);
            } else if (aStartsWithQS) {
                return -1;
            } else if (bStartsWithQS) {
                return 1;
            }
        };

        const newFilterCountries = countries.filter((data) => filter(data, queryString)).sort(comparator);
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
                <ListItem key={`country-${country.label}`}>
                    <CountryCard
                        label={country.label}
                        code={country.code}
                        country={country}
                        setActiveCountry={props.setActiveCountry}
                    />
                </ListItem>
            ))}
            </Infinite>
        </List>
        </>
  );
}
