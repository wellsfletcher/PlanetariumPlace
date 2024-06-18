import React, {MutableRefObject, useEffect, useState} from 'react';

import * as THREE from "three";
// I think it would have to be like this to fix that one warning
// TODO: investigate fixing this multiple instances of three.js imports error further
// import * as THREE from "https://unpkg.com/three/build/three.module.js"; // "https://unpkg.com/three/build/three.module.js";
// <script src="https://unpkg.com/three/build/three.module.js"></script>
// import * as THREE from "three/build/three.module.js";
import Globe, {GlobeMethods} from 'react-globe.gl';
import * as API from '../utils/api';
import usePreloadedImage from './hooks/usePreloadedImage';
import * as System from '../constants/system';
import {drawPixelRgbaBuffer, fillCanvasWithImage} from '../utils/draw';
import useFancyCanvas from "./hooks/useFancyCanvas";
import {Baseboard} from "../constants/Baseboard";
import {COLORING_BASEBOARD_PATH} from "../constants/system";
import useImage from "./hooks/useImage";
import {getWikidataidFromWikidataidBaseboard} from "../modules/board";

// THREE.WebGLRenderer._useLegacyLights = true;
// THREE.WebGLRendererParameters;
// THREE.ColorManagement.enabled = false;
// renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

function randInt(min: number, max?: any): number {
// function randInt(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min | 0;
}

function drawRandomDot(ctx: CanvasRenderingContext2D) {
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
function geo2xy(lat: number, lng: number, width: number, height: number): any {
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

// TODO: rename this and move it somewhere else
export interface CanvasGlobeProps {
    viewFlashback: boolean,
    tilesRgba: Uint8ClampedArray,
    wikidataidRgba: Uint8ClampedArray,
    tiles: number[],
    width: number,
    brushColor: number,
    setViewFlashback: (value: boolean) => void,
    activeBaseboard: Baseboard,
    setActiveBaseboard: (value: Baseboard) => void,
    setTile: ({x, y}, color: number) => void,
    activeCountry: string,
    setActiveCountry: (value: string) => void
}

let globeMaterial = new THREE.MeshPhongMaterial();

function CanvasGlobe(props: CanvasGlobeProps) {
    const globeEl: MutableRefObject<GlobeMethods> = React.useRef();

    const viewFlashback = props.viewFlashback;
    const activeBaseboard = props.activeBaseboard;
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


    // // ------ old canvas code start ------ //
    // const [flashBackImage, setFlashbackImage] = usePreloadedImage(System.FLASHBACK_BOARD_PATH);
    //
    // var draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    //     // drawPixelBuffer(ctx, tiles, width);
    //     // drawPixelRgbaBuffer(ctx, tilesRgba, width);
    //
    //     if (!viewFlashback) {
    //         drawPixelRgbaBuffer(ctx, tilesRgba, width);
    //     } else {
    //         // paintCanvasBlack(ctx, width, height);
    //         // fillCanvasWithImage(ctx, "../../assets/pixel-countries-mid-res.png", width, height);
    //         // console.log(image);
    //         fillCanvasWithImage(ctx, flashBackImage, width, height);
    //     }
    //     // console.log("drew");
    // }
    //
    // // const options = {
    // //     context: "2d"
    // // };
    // // const { context, ...moreConfig } = options;
    // const canvasRef = useCanvas(draw);
    // // ------ old canvas code end ------ //


    // ------ new canvas code start ------ //
    const [flashBackImage, setFlashbackImage] = usePreloadedImage(System.FLASHBACK_BOARD_PATH);
    const [coloringBaseboardImage, setColoringBaseboardImage] = usePreloadedImage(System.COLORING_BASEBOARD_PATH);

    const highlightFileName = (props.activeCountry == null || props.activeCountry == "" ? "empty" : props.activeCountry) + ".png";
    // const highlightFileName = (props.activeCountry == null || props.activeCountry == "" ? "Q16" : props.activeCountry) + ".png";
    // console.log(["highlightFileName", highlightFileName]);
    // const [territoryHighlightImage, setTerritoryHighlightImage] = usePreloadedImage(System.CANADA_HIGHLIGHT_PATH);
    // wait is the functions input just the initial value? I think it's probably like just not done loading, when click it
    // TODO: figure out the above problem
    //- const [territoryHighlightImage, setTerritoryHighlightImage] = usePreloadedImage(System.HIGHLIGHTS_FOLDER + highlightFileName);
    // const [territoryHighlightImage, setTerritoryHighlightImage] = usePreloadedImage(System.HIGHLIGHTS_FOLDER + "Q16.png");
    const territoryHighlightImage = useImage(System.HIGHLIGHTS_FOLDER + highlightFileName);

    // console.log(["System.CANADA_HIGHLIGHT_PATH", System.CANADA_HIGHLIGHT_PATH]);

    const drawBoard = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        drawPixelRgbaBuffer(ctx, tilesRgba, width);
    }
    const drawFlashback = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        fillCanvasWithImage(ctx, flashBackImage, width, height);
    }
    const drawColoringBaseboard = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        fillCanvasWithImage(ctx, coloringBaseboardImage, width, height);
    }
    const drawHighlight = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (territoryHighlightImage != null) {
            fillCanvasWithImage(ctx, territoryHighlightImage, width, height);
        }
    }

    let layers = [];
    if (activeBaseboard == Baseboard.FLASHBACK) {
        layers = [drawFlashback, drawHighlight];
    } else if (activeBaseboard == Baseboard.COLORING) {
        layers = [drawColoringBaseboard, drawHighlight];
    } else {
        layers = [drawBoard, drawHighlight];
    }

    // const options = {
    //     context: "2d"
    // };
    // const { context, ...moreConfig } = options;
    const canvasRef = useFancyCanvas(layers);
    // ------ new canvas code end ------ //



    // ------ new canvas code start ------ //

    // const { canvasRefs, baseCanvasRef } = useLayeredCanvas([
    //     {
    //         drawFunction: (ctx, frameCount) => {
    //             drawPixelRgbaBuffer(ctx, tilesRgba, width);
    //         },
    //         enabled: !viewFlashback
    //     },
    //     {
    //         drawFunction: (ctx, frameCount) => {
    //             fillCanvasWithImage(ctx, flashBackImage, width, height);
    //         },
    //         enabled: viewFlashback
    //     }
    // ]);

    // ------ new canvas code end ------ //



    // console.log("globe rendered");

    // // ------ define globe material ------ //
    // let globeMaterial = new THREE.MeshPhongMaterial();
    //
    // const canvas = canvasRef.current;
    // const texture = new THREE.CanvasTexture(canvas);
    // // pixelate the texture
    // texture.magFilter = THREE.NearestFilter;
    // texture.minFilter = THREE.LinearMipMapLinearFilter;
    //
    // globeMaterial.emissive = new THREE.Color(0xffffff);
    // // globeMaterial.emissive = new THREE.Color(0x111111);
    // globeMaterial.emissiveMap = texture;
    // // it should only be marked for update when tiles change, so I probably still need to use useEffect
    // //- texture.needsUpdate = true;
    // // React.useEffect(() => {
    // //     texture.needsUpdate = true;
    // // }, [props.viewFlashback, props.tiles]);
    // // ------ define globe material ------ //

    // // ------ define globe material ------ //
    // // THREE.ColorManagement.enabled = false;
    // let globeMaterial = new THREE.MeshPhongMaterial();
    //
    // const canvas = canvasRef.current;
    // const texture = new THREE.CanvasTexture(canvas);
    // // pixelate the texture
    // // texture.colorSpace = THREE.LinearSRGBColorSpace; // this actually makes a visible impact // NoColorSpace
    // texture.magFilter = THREE.NearestFilter;
    // texture.minFilter = THREE.LinearMipMapLinearFilter;
    //
    // const t = "#ffffff";
    // // globeMaterial.emissive = new THREE.Color(0xffffff); // "#ffffff"
    // globeMaterial.emissive = new THREE.Color(0xffffff);
    // // globeMaterial.emissive = new THREE.Color(0x111111);
    // // globeMaterial.emissiveIntensity = 1000;
    // // globeEl.current.renderer()._useLegacyLights = true;
    // if (globeEl.current != null) {
    //     console.log("Setting globeEl.current properties...");
    //     // globeEl.current.renderer().outputColorSpace = THREE.LinearSRGBColorSpace; // LinearSRGBColorSpace
    // }
    // globeMaterial.emissiveMap = texture;
    // // globeMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace;
    // // globeMaterial.map = texture;
    // // it should only be marked for update when tiles change, so I probably still need to use useEffect
    // //- texture.needsUpdate = true;
    // // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI);
    // // React.useEffect(() => {
    // //     texture.needsUpdate = true;
    // // }, [props.viewFlashback, props.tiles]);
    // // ------ define globe material ------ //

    // // ------ define globe material ------ //
    // // THREE.ColorManagement.enabled = false;
    // let globeMaterial = new THREE.MeshPhongMaterial();
    // // let globeMaterial = new THREE.MeshBasicMaterial(); // works almost perfect
    // // let globeMaterial = new THREE.MeshStandardMaterial();
    // // let globeMaterial = new THREE.MeshLambertMaterial();
    //
    // const canvas = canvasRef.current;
    // const texture = new THREE.CanvasTexture(canvas);
    // // pixelate the texture
    // texture.colorSpace = THREE.SRGBColorSpace; // this actually makes a visible impact // NoColorSpace
    // texture.magFilter = THREE.NearestFilter;
    // texture.minFilter = THREE.LinearMipMapLinearFilter;
    //
    // // globeMaterial.emissive = new THREE.Color(0xffffff); // "#ffffff"
    // // globeMaterial.emissive = new THREE.Color(0xffffff);
    // // globeMaterial.emissive = new THREE.Color(0x111111);
    // // globeMaterial.emissiveIntensity = 0.5;
    // // globeEl.current.renderer()._useLegacyLights = true;
    // // globeMaterial.emissiveMap = texture;
    // if (globeEl.current != null) {
    //     console.log("Setting globeEl.current properties...");
    //     // globeEl.current.renderer().outputColorSpace = THREE.SRGBColorSpace; // LinearSRGBColorSpace
    //     // globeEl.current.renderer().outputColorSpace = THREE.SRGBColorSpace;
    //     // globeEl.current.renderer().colorSpace = THREE.SRGBColorSpace;
    // }
    // // globeMaterial.emissiveMap = texture;
    // // globeMaterial.specular = new THREE.Color('red'); // this is the thing that doesn't show up when you use MeshBasicMaterial
    // // globeMaterial.specular = new THREE.Color('dimgrey'); // grey // dimgrey // 0x888888 // 0x1B1B1B // 0x606060
    // // globeMaterial.specular = new THREE.Color('dimgrey');
    // globeMaterial.specular = new THREE.Color('white');
    // // globeMaterial.specularMap = texture;
    // // globeMaterial.map = null;
    // // globeMaterial.color = new THREE.Color(0x000000);
    // // globeMaterial.color = null;
    // globeMaterial.map = texture;
    // // globeMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace;
    // // globeMaterial.map = texture;
    // // it should only be marked for update when tiles change, so I probably still need to use useEffect
    // //- texture.needsUpdate = true;
    // // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI);
    // useEffect(() => {
    //     // const directionalLight = globeEl.current.lights().find(obj3d => obj3d.type === 'DirectionalLight');
    //     // directionalLight && directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect
    //     // globeEl.current.scene().add(new THREE.AmbientLight(0xcccccc, 1.5 * Math.PI));
    //
    //     const ambientLight = globeEl.current.lights().find(obj3d => obj3d.type === 'AmbientLight');
    //     // directionalLight && directionalLight.intensity = 0;
    //     // ambientLight.intensity = 0;
    //     ambientLight.intensity = 1.65 * Math.PI;
    //     // ambientLight.intensity = 5.0;
    //     // ambientLight.intensity = 1;
    //
    //     const directionalLight = globeEl.current.lights().find(obj3d => obj3d.type === 'DirectionalLight');
    //     // directionalLight && directionalLight.intensity = 0;
    //     directionalLight.intensity = 0.03 * Math.PI;
    //     // directionalLight.intensity = 0;
    //     // directionalLight.color = new THREE.Color('white');
    //
    //     // const light = new THREE.AmbientLight(0xffffff, 1 * Math.PI);
    //     // globeEl.current.scene().add(light);
    //
    //     // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI);
    //     // globeEl.current.scene().add(directionalLight);
    //     // directionalLight.position.set(0, -10, 0);
    //     // directionalLight.position.set(1, 1, 1);
    // }, []);
    // // React.useEffect(() => {
    // //     texture.needsUpdate = true;
    // // }, [props.viewFlashback, props.tiles]);
    // console.log(globeMaterial);
    // // ------ define globe material ------ //


    // ------ define globe material ------ //
    // let globeMaterial = new THREE.MeshPhongMaterial();

    // const canvas = canvasRef.current;
    // const texture = new THREE.CanvasTexture(canvas);
    // // pixelate the texture
    // texture.magFilter = THREE.NearestFilter;
    // texture.minFilter = THREE.LinearMipMapLinearFilter;
    // texture.colorSpace = THREE.SRGBColorSpace; // this actually makes a visible impact // NoColorSpace
    //
    // globeMaterial.specular = new THREE.Color('white');
    // globeMaterial.map = texture;
    useEffect(() => {
        const canvas = canvasRef.current;
        const texture = new THREE.CanvasTexture(canvas);
        // pixelate the texture
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace; // this actually makes a visible impact // NoColorSpace

        globeMaterial.specular = new THREE.Color('white');
        globeMaterial.map = texture;
        // console.log(globeMaterial);

        const ambientLight = globeEl.current.lights().find(obj3d => obj3d.type === 'AmbientLight');
        ambientLight.intensity = 1.65 * Math.PI;

        const directionalLight = globeEl.current.lights().find(obj3d => obj3d.type === 'DirectionalLight');
        directionalLight.intensity = 0.03 * Math.PI;
    }, [territoryHighlightImage, props.viewFlashback, props.tiles, props.activeBaseboard]);
    // React.useEffect(() => {
    //     texture.needsUpdate = true;
    // }, [props.viewFlashback, props.tiles]);
    // console.log(globeMaterial);
    // ------ define globe material ------ //
    // console.log("Rendering globe..."); // this currently rerenders on every mouse interaction

    // React.useEffect(() => {
    //     // if (globeEl.current == null) {
    //     //     return;
    //     // }
    //
    //     let globeMaterial = globeEl.current.globeMaterial();
    //     // const camera = globeEl.current.camera();
    //     // console.log(camera);
    //
    //     const canvas = canvasRef.current;
    //     const texture = new THREE.CanvasTexture(canvas);
    //     // pixelate the texture
    //     texture.magFilter = THREE.NearestFilter;
    //     texture.minFilter = THREE.LinearMipMapLinearFilter;
    //
    //     // globeMaterial.bumpScale = 10;
    //     // globeMaterial.map = texture;
    //     // texture.needsUpdate = true;
    //
    //     // I should no longer need to ever print this stuff to the console, since I can just right click on the canvas and download it nowadays
    //     // console.log("globe texture updating...");
    //     // this line of code longer causes everything to explode on safari!
    //     //- dataUrl = canvas.toDataURL("image/png"); // for someone reason this line of codes makes everything work on safari :(
    //     // var context = canvas.getContext("2d");
    //     // var dafdasdf = canvas.getImageData(10, 10, 50, 50);
    //     //- console.log(dataUrl);
    //
    //     globeMaterial.emissive = new THREE.Color(0xffffff);
    //     // globeMaterial.emissive = new THREE.Color(0x111111);
    //     globeMaterial.emissiveMap = texture;
    //     texture.needsUpdate = true;
    //     // globeMaterial.needsUpdate = true;
    //     //- console.log("globe texture updated");
    //
    // }, [props.viewFlashback, props.tiles]); // the props.tiles made it magically start updating the globe; but it still doesn't update on Safari

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
        // console.debug("deltaRotation = " + deltaRotation + " = " + mapRotationOnTouchStart + " - " + mapRotation);
        // console.debug("deltaScale = " + deltaScale + " = " + mapScaleOnTouchStart + " - " + mapScale);

        // TODO: Investigate if I can get rid of this; would need to be able to like test on mobile though
        if (Math.abs(deltaRotation) > MAP_ROTATION_TOLERANCE || Math.abs(deltaScale) > MAP_ROTATION_TOLERANCE) {
            console.debug("Click do be aborted.");
            return;
        }

        // console.log({ lat, lng });
        const {x, y} = geo2xy(lat, lng, width, height);
        // console.log({x, y});
        var color = props.brushColor;

        // try getting the wikidataid of the clicked on tile here
        let wikidataid = getWikidataidFromWikidataidBaseboard(props.wikidataidRgba, {x, y}, width);
        // then try using setActiveCountry to change the highlighted country
        // console.log(["Clicked and got wikidataid: ", wikidataid]);
        props.setActiveCountry(wikidataid);

        // exit if in view flashback mode
        if (viewFlashback) {
            props.setViewFlashback(false);
            return;
        }

        if (activeBaseboard != Baseboard.INTERACTIVE) {
            props.setActiveBaseboard(Baseboard.INTERACTIVE);
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
    /*
    React.useEffect(() => {
        // load data
        // fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
        // {"type":"FeatureCollection","features": asdfasdfasdf}
        fetch('/assets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
    }, []);
    */

    // this right here really needs to be renamed
    // yeah this just tripped me up
    const [activeCountry, setActiveCountry] = React.useState([]);

    React.useEffect(() => {
        // load data
        // fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
        // {"type":"FeatureCollection","features": asdfasdfasdf}
        //- fetch('/assets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
        // API.fetchTerritoryGeojsonFromName(props.activeCountry).then(res => res.json()).then(setCountries);
        if (props.activeCountry == null || props.activeCountry == "") {
            // setActiveCountry([]); // hmmm
            return;
        }
        // console.debug("props.activeCountry = ");
        // console.debug(props.activeCountry);

        // --- probably don't need to fetch the geojson anymore hopefully --- //
        return;

        API.fetchTerritoryGeojsonFromName(props.activeCountry).then(res => {
            console.log("fetched country = ");
            console.log(res);
            // return res.json();
            // return {"type": "FeatureCollection", "features": res};
            //- return {"type": "FeatureCollection", "features": res};
            //-- setCountries({"type": "FeatureCollection", "features": res});
            // setActiveCountry(countries.features.filter(filter)); // you probably don't need to filter this anymore // unless maybe you want to cache stuff
            //- setActiveCountry(res.filter(filter));
            setActiveCountry(res);
        })/*.then(setCountries)
        .then(() => setActiveCountry(countries.features.filter(filter)));*/

        // API.fetchTerritoryGeojsonFromName(props.activeCountry).then(res => res.json()).then(setCountries);
    }, [props.activeCountry]);
    // const [activeCountry, setActiveCountry] = React.useState([]);
    // React.useEffect(() => {
    //     setActiveCountry(countries.features.filter(filter));
    //     // console.log(JSON.stringify(activeCountry));
    //     // console.log(props.activeCountry);
    // }, [props.activeCountry]);

    // GDP per capita (avoiding countries with small pop)
    /*
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
    */

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
    // const testCountry = [{"type":"Feature","bbox":[-84.821711,38.414973,-80.519081,42.324392],"properties":{"name_long":"Ohio","wikidataid":"Q1397"},"geometry":{"type":"Polygon","coordinates":[[[-83.121665,41.95],[-83.029962,41.832974],[-82.8662,41.753004],[-82.690012,41.675177],[-82.439073,41.67487],[-82.213326,41.77869],[-81.974187,41.88874],[-81.76092,41.986815],[-81.507345,42.103479],[-81.277643,42.209179],[-81.028198,42.247158],[-80.682645,42.299772],[-80.520762,42.324392],[-80.520278,42.220473],[-80.520278,42.115619],[-80.520278,42.010766],[-80.520278,41.905923],[-80.520278,41.801069],[-80.520278,41.696238],[-80.520278,41.591417],[-80.520278,41.486564],[-80.520278,41.38171],[-80.520278,41.276857],[-80.520278,41.172014],[-80.520278,41.067183],[-80.520278,40.962362],[-80.520278,40.857509],[-80.520278,40.752655],[-80.519081,40.646956],[-80.637524,40.603263],[-80.659047,40.562976],[-80.623187,40.51156],[-80.604093,40.445203],[-80.601819,40.363893],[-80.668275,40.185244],[-80.803517,39.909136],[-80.872192,39.735508],[-80.874313,39.664294],[-80.963291,39.57113],[-81.139127,39.455994],[-81.262504,39.386538],[-81.333354,39.362819],[-81.392417,39.364829],[-81.439647,39.392559],[-81.492722,39.373618],[-81.551631,39.308041],[-81.606464,39.274137],[-81.657209,39.271973],[-81.700594,39.229467],[-81.736663,39.14663],[-81.770665,39.098828],[-81.802602,39.086062],[-81.804954,39.04405],[-81.777685,38.972793],[-81.780124,38.946975],[-81.795033,38.945942],[-81.809337,38.950029],[-81.843757,38.934319],[-81.88244,38.894219],[-81.896678,38.893549],[-81.907368,38.900239],[-81.91853,38.952347],[-81.949797,38.989327],[-82.001092,39.011102],[-82.072273,38.962949],[-82.163328,38.844912],[-82.203527,38.768228],[-82.18764,38.715208],[-82.180071,38.637589],[-82.202494,38.605839],[-82.252317,38.594083],[-82.290868,38.552017],[-82.318147,38.479672],[-82.387064,38.43399],[-82.497543,38.414973],[-82.612778,38.448218],[-82.621282,38.450679],[-82.758226,38.541162],[-82.844623,38.627668],[-82.880438,38.710253],[-83.000068,38.713999],[-83.203469,38.638907],[-83.35697,38.627405],[-83.460582,38.679502],[-83.538387,38.69986],[-83.616313,38.682776],[-83.689878,38.649531],[-83.752269,38.669373],[-83.828086,38.731226],[-83.948386,38.774226],[-84.113236,38.798385],[-84.227285,38.865204],[-84.290435,38.974705],[-84.358022,39.049917],[-84.43006,39.090896],[-84.508865,39.102838],[-84.594547,39.085776],[-84.660542,39.094467],[-84.706948,39.128909],[-84.765901,39.124998],[-84.821711,39.091984],[-84.82014,39.423826],[-84.816702,39.749197],[-84.813263,40.074557],[-84.809835,40.399939],[-84.806397,40.725321],[-84.802958,41.05067],[-84.799552,41.376052],[-84.796113,41.701434],[-84.463129,41.710938],[-84.130155,41.720452],[-83.797181,41.729955],[-83.464197,41.739447],[-83.30395,41.837808],[-83.121665,41.95]]]}}];
    // this adds a considerable amount of load time
    // and it blocks clicks :(
    // god damn it of course the polygons block clicks
    const countryProps = {
        globeMaterial: globeMaterial,
        // rendererConfig: {useLegacyLights: true, _useLegacyLights: true},
        // rendererConfig: {outputColorSpace: THREE.LinearSRGBColorSpace},
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
        polygonLabel: ({ properties: d }) => `
            <b>${d.name_long}</b> <br />
        `,
        // polygonLabel: label,
        polygonsTransitionDuration: 0
    };

    //- const countryProps = {};

    const rest = {
        width: width,
        height: height,
        style: {
            // Commented out bc of TS error
            //- imageRendering: "pixelated",
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
