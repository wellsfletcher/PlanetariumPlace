import React from 'react';
import { useState, useEffect } from 'react';

import * as THREE from "three";
import Globe from 'react-globe.gl';

import { int2hexcolor, xy2index } from '../utils/general';
import useCanvas from './useCanvas';
import useWindowDimensions from './useWindowDimensions';
import { drawPixelBuffer, drawImageData } from '../utils/draw';

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

    var tiles = props.tiles;
    var width = props.width;
    var height = tiles.length / width;

    var draw = (ctx, frameCount) => {
        drawPixelBuffer(ctx, tiles, width);
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
        // console.log(dataUrl);

        globeMaterial.emissive = new THREE.Color(0xffffff);
        // globeMaterial.emissive = new THREE.Color(0x111111);
        globeMaterial.emissiveMap = texture;
        texture.needsUpdate = true;
        // globeMaterial.needsUpdate = true;
        //- console.log("globe texture updated");

    }, [props.tiles]); // the props.tiles made it magically start updating the globe; but it still doesn't update on Safari

    const MAP_ROTATION_TOLERANCE = 0.001;
    // const [mapRotation, setMapRotation] = useState(new THREE.Vector3( 0, 0, 0 ));
    const [mapScale, setMapScale] = useState(2.5);
    const [mapScaleOnTouchStart, setMapScaleOnTouchStart] = useState(2.5);
    const [mapRotationOnTouchStart, setMapRotationOnTouchStart] = useState(new THREE.Vector3( 0, 0, 0 ));
    const onMapTouchStart = (event) => {
        // event.preventDefault();
        console.log(event);
        if (event.touches.length > 1) {
            console.log("Aborted with weary face.");
            return;
        }

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
        console.log(event.defaultPrevented);
        console.log(event);

        const camera = globeEl.current.camera();
        const mapRotation = camera.getWorldDirection(new THREE.Vector3());
        // const mapRotation = camera.position;
        // const mapRotation = camera.rotation.toVector3();
        // console.log(camera.position);
        console.log(camera);
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

    /*
    const [countries, setCountries] = React.useState({ features: []});
    React.useEffect(() => {
        // load data
        // fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
        fetch('/assets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
    }, []);
    // this adds a considerable amount of load time
    // and it blocks clicks :(
    // god damn it of course the polygons block clicks
    const countryProps = {
        polygonsData: countries.features,
        polygonAltitude: .008,
        polygonCapColor: () => 'rgba(100, 100, 100, 0)',
        polygonSideColor: () => 'rgba(0, 0, 0, 0)',
        polygonLabel: ({ properties: d }) => `
            <b>${d.ADMIN}</b> <br />
        `,
    };
    */
    const countryProps = {};

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
    // onPointerDown={onMapTouchStart}
    return (
        <div
            onTouchStart={onMapTouchStart}
            onMouseUp={onMapTouchStart}
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
