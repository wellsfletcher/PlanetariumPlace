import React from 'react';
import { useState, useEffect } from 'react';
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.darkPaper,
  },
}));


export default function CountrySearch(props) {
    const materialProps = props;
    const classes = useStyles();

    const filter = (data) => {
        /*
        if (data.suggested == true && (queryString == null
            || data.label.toLowerCase().includes(queryString))) {
                return data;
            }
            */
        if (data.suggested == true) {
            return data;
        }
    };

    const [filtered, setFiltered] = useState(countries.filter(filter));
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
        const newFilterCountries = countries.filter((data) => {
            /*
            if (data.suggested == true && (queryString == null
                || data.label.toLowerCase().includes(queryString))) {
                    return data;
                }
                */
            if (data.suggested == true && data.label.toLowerCase().includes(queryString)) {
                return data;
            }
        });
        setFiltered(newFilterCountries);
    };

  return (
    <>
        <List className={classes.root}>
            <ListItem>
              <SearchBar onChange={onChange}/>
            </ListItem>

            {filtered.map((country) => (
                <ListItem key={`country-${country.label}`}>
                    <CountryCard
                        label={country.label}
                        code={country.code}
                        country={country}
                    />
                </ListItem>
            ))}
        </List>
        </>
  );
}
