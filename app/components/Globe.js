import React from 'react';
import { useState, useEffect, useMemo } from 'react';

import * as THREE from "three";
import Globe from 'react-globe.gl';
import * as API from '../utils/api';

import useCanvas from './useCanvas';
import useWindowDimensions from './useWindowDimensions';
import usePreloadedImage from './hooks/usePreloadedImage';
import * as System from '../constants/system';
import { int2hexcolor, xy2index } from '../utils/general';
import { drawPixelBuffer, drawPixelRgbaBuffer, drawImageData, paintCanvasBlack, fillCanvasWithImage } from '../utils/draw';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function randInt(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min | 0;
}

function drawRandomDot(ctx) {
    ctx.fillStyle = `#${randInt(0x1000000).toString(16).padStart(6, '0')}`;
    ctx.beginPath();

    const x = randInt(256);
    const y = randInt(256);
    const radius = randInt(10, 64);
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

/*
Converts the given latitude and longitude to be in terms of x, y texture coordinates.
@width the width in pixels of the texture
@height the height in pixels of the texture
 */
function geo2xy(lat, lng, width, height) {
    // note y needs to start from the top of the globe
    const MIN_LNG = -180;
    const MAX_LNG = 180;
    const MIN_LAT = -90;
    const MAX_LAT = 90;
    const TOTAL_LNG = MAX_LNG - MIN_LNG;
    const TOTAL_LAT = MAX_LAT - MIN_LAT;
    const LNG_TO_X = width / TOTAL_LNG;
    const LAT_TO_Y = height / TOTAL_LAT;
    const x = (lng - MIN_LNG) * LNG_TO_X;
    const y = height - ((lat - MIN_LAT) * LAT_TO_Y);
    // return {x: x, y: y};
    return {x: Math.floor(x), y: Math.floor(y)};
}

function CanvasGlobe(props) {
    const globeEl = React.useRef();

    const viewFlashback = props.viewFlashback;
    // const setViewFlashback = props.setViewFlashback;
    var tilesRgba = props.tilesRgba;
    var tiles = props.tiles;
    var width = props.width;
    var height = tiles.length / width;

    /*
    // maybe change this to a custom usePreloadedImage hook
    const [flashBackImage, setFlashbackImage] = useState(new Image());
    React.useEffect(() => {
        // console.log("image loading");
        flashBackImage.src = "../../assets/pixel-countries-mid-res.png";
        flashBackImage.onload = () => {
            console.log("imaged loaded");
            // console.log(image);
        };
        setFlashbackImage(flashBackImage);
    }, []);
    */
    // console.log(System.FLASHBACK_BOARD_PATH); // this in base 64 for some reason...
    const [flashBackImage, setFlashbackImage] = usePreloadedImage(System.FLASHBACK_BOARD_PATH);

    var draw = (ctx, frameCount) => {
        // drawPixelBuffer(ctx, tiles, width);
        // drawPixelRgbaBuffer(ctx, tilesRgba, width);

        if (!viewFlashback) {
            drawPixelRgbaBuffer(ctx, tilesRgba, width);
        } else {
            // paintCanvasBlack(ctx, width, height);
            // fillCanvasWithImage(ctx, "../../assets/pixel-countries-mid-res.png", width, height);
            // console.log(image);
            fillCanvasWithImage(ctx, flashBackImage, width, height);
        }
        // console.log("drew");
    }

    const options = {
        context: "2d"
    };
    const { context, ...moreConfig } = options;
    const canvasRef = useCanvas(draw, {context});

    // console.log("globe rendered");

    React.useEffect(() => {
        const globeMaterial = globeEl.current.globeMaterial();
        // const camera = globeEl.current.camera();
        // console.log(camera);

        const canvas = canvasRef.current;
        const texture = new THREE.CanvasTexture(canvas);
        // pixelate the texture
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        // globeMaterial.bumpScale = 10;
        // globeMaterial.map = texture;
        // texture.needsUpdate = true;

        // console.log("globe texture updating...");
        var dataUrl = canvas.toDataURL("image/png"); // for someone reason this line of codes makes everything work on safari :(
        // var context = canvas.getContext("2d");
        // var dafdasdf = canvas.getImageData(10, 10, 50, 50);
        console.log(dataUrl);

        globeMaterial.emissive = new THREE.Color(0xffffff);
        // globeMaterial.emissive = new THREE.Color(0x111111);
        globeMaterial.emissiveMap = texture;
        texture.needsUpdate = true;
        // globeMaterial.needsUpdate = true;
        //- console.log("globe texture updated");

    }, [props.viewFlashback, props.tiles]); // the props.tiles made it magically start updating the globe; but it still doesn't update on Safari

    const MAP_ROTATION_TOLERANCE = 0.001;
    // const [mapRotation, setMapRotation] = useState(new THREE.Vector3( 0, 0, 0 ));
    const [mapScale, setMapScale] = useState(2.5);
    const [mapScaleOnTouchStart, setMapScaleOnTouchStart] = useState(2.5);
    const [mapRotationOnTouchStart, setMapRotationOnTouchStart] = useState(new THREE.Vector3( 0, 0, 0 ));
    const onMapTouchStart = (event) => {
        // event.preventDefault();
        // console.log("gesture started!");
        // console.log(event);
        /*
        if (event.touches.length > 1) {
            console.log("Aborted with weary face.");
            return;
        }
        */

        const camera = globeEl.current.camera();
        setMapRotationOnTouchStart(camera.getWorldDirection(new THREE.Vector3()));
        // console.log(camera.position);
        // setMapRotationOnTouchStart(camera.position);
        setMapScaleOnTouchStart(mapScale);
    };
    const onZoom = (event) => {
        // console.log(event);
        // console.log();
        const altitude = event.altitude;
        setMapScale(altitude);
    };

    const onGlobeClick = ({ lat, lng }, event) => {
        // event.preventDefault(); // this may add a delay to clicks being registered?
        if (event.defaultPrevented) return; // aaaaaaaaaaaaaaaaaaaa
        //-- if (viewFlashback) return; // may wanna make it so that if you click anywhere it changes the viewFlashback state
        //- console.log(event.defaultPrevented);
        // console.log(event);

        const camera = globeEl.current.camera();
        const mapRotation = camera.getWorldDirection(new THREE.Vector3());
        // const mapRotation = camera.position;
        // const mapRotation = camera.rotation.toVector3();
        // console.log(camera.position);
        //- console.log(camera);
        var deltaRotation = mapRotation.distanceTo(mapRotationOnTouchStart);
        var deltaScale = mapScaleOnTouchStart - mapScale;
        console.log("deltaRotation = " + deltaRotation + " = " + mapRotationOnTouchStart + " - " + mapRotation);
        console.log("deltaScale = " + deltaScale + " = " + mapScaleOnTouchStart + " - " + mapScale);
        if (Math.abs(deltaRotation) > MAP_ROTATION_TOLERANCE || Math.abs(deltaScale) > MAP_ROTATION_TOLERANCE) {
            console.log("Click do be aborted.");
            return;
        }

        // console.log({ lat, lng });
        const {x, y} = geo2xy(lat, lng, width, height);
        // console.log({x, y});
        var color = props.brushColor;

        // exit if in view flashback mode
        if (viewFlashback) {
            props.setViewFlashback(false);
            return;
        }

        // temporarily disabled
        props.setTile({x, y}, color);

        /*
        window.addEventListener(
            'click',
            captureClick,
            true // <-- This registeres this listener for the capture
                 //     phase instead of the bubbling phase!
        );
        */
    };
    /*
    function captureClick(e) {
        e.stopPropagation(); // Stop the click from being propagated.
        console.log('click captured');
        window.removeEventListener('click', captureClick, true); // cleanup
    }
    */

    const clickHandlerProps = {
        onGlobeClick: onGlobeClick,
        onClick: function(e){
            console.log('click');
        }
    };

    const filter = d => {
        // console.log("activeCountry = " + props.activeCountry);
        return d.properties.ADMIN != undefined
            && props.activeCountry != undefined
            // && d.properties.ADMIN.toLowerCase() === props.activeCountry.toLowerCase();
            && (props.activeCountry.toLowerCase().includes(d.properties.ADMIN.toLowerCase())
            || d.properties.ADMIN.toLowerCase().includes(props.activeCountry.toLowerCase())
            );
    };

    const [countries, setCountries] = React.useState({ features: []});
    React.useEffect(() => {
        // load data
        // fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
        fetch('/assets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
    }, []);
    const [activeCountry, setActiveCountry] = React.useState([]);
    React.useEffect(() => {
        setActiveCountry(countries.features.filter(filter));
        console.log(JSON.stringify(activeCountry));
        console.log(props.activeCountry);
    }, [props.activeCountry]);

    // GDP per capita (avoiding countries with small pop)
    const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
    const maxVal = useMemo(
      () => Math.max(...countries.features.map(getVal)),
      [countries]
    );

    const colorScale = (value, maxValue) => {
        const phase = 0;
        const center = 200; // 128;
        const width = 55; // 127;
        var frequency = Math.PI*2 / maxValue;
        var i = value;
        var red = Math.sin(frequency*i+2+phase) * width + center;
        var green = Math.sin(frequency*i+0+phase) * width + center;
        var blue = Math.sin(frequency*i+4+phase) * width + center;
        // return 'rgba(0, 100, 0, 0.15)';
        return 'rgba(' + red + ', ' + green + ', ' + blue + ', 0.8)';
    };

    /*
    const label = (<Tooltip title="Delete">
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </Tooltip>);
    */

    // you don't need the properties attribute for this to work
    // nor the bounding box or feature type
    // apparently you need some sort of ID for this to work
    // but I am still going to make the endpoint include bbox, geometry_type, geometry_coordinates
        // and maybe name and some kind of ID
    // const testCountry = [[[21.02004,40.842727],[20.99999,40.580004],[20.674997,40.435],[20.615,40.110007],[20.150016,39.624998],[19.98,39.694993],[19.960002,39.915006],[19.406082,40.250773],[19.319059,40.72723],[19.40355,41.409566],[19.540027,41.719986],[19.371769,41.877548],[19.371768,41.877551],[19.304486,42.195745],[19.738051,42.688247],[19.801613,42.500093],[20.0707,42.58863],[20.283755,42.32026],[20.52295,42.21787],[20.590247,41.855409],[20.590247,41.855404],[20.463175,41.515089],[20.605182,41.086226],[21.02004,40.842727]]];
    // const testCountry = [{"type":"Feature","bbox":[19.304486,39.624998,21.02004,42.688247],"geometry":{"type":"Polygon","coordinates":[[[21.02004,40.842727],[20.99999,40.580004],[20.674997,40.435],[20.615,40.110007],[20.150016,39.624998],[19.98,39.694993],[19.960002,39.915006],[19.406082,40.250773],[19.319059,40.72723],[19.40355,41.409566],[19.540027,41.719986],[19.371769,41.877548],[19.371768,41.877551],[19.304486,42.195745],[19.738051,42.688247],[19.801613,42.500093],[20.0707,42.58863],[20.283755,42.32026],[20.52295,42.21787],[20.590247,41.855409],[20.590247,41.855404],[20.463175,41.515089],[20.605182,41.086226],[21.02004,40.842727]]]},"__id":"437616899"}];
    // this adds a considerable amount of load time
    // and it blocks clicks :(
    // god damn it of course the polygons block clicks
    const countryProps = {
        // polygonsData: countries.features,
        // polygonsData: countries.features.filter(filter),
        polygonsData: activeCountry,
        // polygonsData: testCountry,
        polygonAltitude: .2, // .008,
        // polygonCapColor: () => 'rgba(100, 50, 100, .5)',
        // polygonCapColor: d => colorScale(getVal(d), maxVal),
        polygonCapColor: () => '#E5D900', //'#888888', // E5D900 // 00D3DD
        // polygonSideColor: () => 'rgba(0, 0, 0, 1.0)',
        polygonSideColor: () => '#1B1B1B',
        /*
        polygonLabel: ({ properties: d }) => `
            <b>${d.ADMIN}</b> <br />
        `,
        */
        // polygonLabel: label,
        polygonsTransitionDuration: 300
    };

    //- const countryProps = {};

    const rest = {
        width: width,
        height: height,
        style: {
            imageRendering: "pixelated",
            cursor: "crosshair",
            display: "none"
        }
    };


    //- const { windowWidth, windowHeight } = useWindowDimensions();
    //- rendererSize={new THREE.Vector2(windowWidth, windowHeight)}
    // onGlobeClick={onGlobeClick}
    // console.log({ windowHeight, windowWidth });
    // default backgroundColor = 000011
    // default backgroundColor in practice = #00000E
    // #242424
    // showGraticules={true}
    // globeImageUrl="https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe_dark.jpg"
    // globeImageUrl="../../assets/pixel-countries-mid-res.png"
    // globeImageUrl={(viewFlashback) ? "../../assets/pixel-countries-mid-res.png" : ""}
    // {(viewFlashback) ? globeImageUrl="../../assets/pixel-countries-mid-res.png" : null}
    // onPointerDown={onMapTouchStart}
    // onTouchStart={onMapTouchStart}
    return (
        <div
            onPointerDown={onMapTouchStart}
        >
            <Globe
                ref={globeEl}
                backgroundColor={"#000011"}
                showGraticules={true}
                {...clickHandlerProps}
                onZoom={onZoom}
                {...countryProps}
            />
            <canvas
                ref={canvasRef}
                {...rest}
            />
        </div>
    );
}

export default CanvasGlobe;
