import React from 'react';

import * as THREE from "three";
import Globe from 'react-globe.gl';

import { int2hexcolor, xy2index } from '../utils/general';
import useCanvas from './useCanvas';
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
    }

    const options = {
        context: "2d"
    };
    const { context, ...moreConfig } = options;
    const canvasRef = useCanvas(draw, {context});



    React.useEffect(() => {
        const globeMaterial = globeEl.current.globeMaterial();

        const canvas = canvasRef.current;
        const texture = new THREE.CanvasTexture(canvas);
        // pixelate the texture
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        // globeMaterial.bumpScale = 10;
        // globeMaterial.map = texture;
        // texture.needsUpdate = true;

        globeMaterial.emissive = new THREE.Color(0xffffff);
        // globeMaterial.emissive = new THREE.Color(0x111111);
        globeMaterial.emissiveMap = texture;
        texture.needsUpdate = true;

    }, [props.tiles]); // the props.tiles made it magically start updating the globe; but it still doesn't update on Safari

    const onGlobeClick = ({ lat, lng }, event) => {
        // console.log(event);
        // console.log({ lat, lng });
        const {x, y} = geo2xy(lat, lng, width, height);
        // console.log({x, y});
        var color = props.brushColor;
        props.setTile({x, y}, color);
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

    // default backgroundColor = 000011
    // default backgroundColor in practice = #00000E
    // #242424
    // showGraticules={true}
    return (
        <>
            <Globe
                ref={globeEl}
                backgroundColor={"#000011"}
                globeImageUrl="https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe_dark.jpg"
                showGraticules={true}
                onGlobeClick={onGlobeClick}

                {...countryProps}
            />
            <canvas
                ref={canvasRef}
                {...rest}
            />
        </>
    );
}

export default CanvasGlobe;
