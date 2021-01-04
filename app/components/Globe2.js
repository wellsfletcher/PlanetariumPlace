import React from 'react';

import * as THREE from "three";
import Globe from 'react-globe.gl';
import { int2hexcolor, xy2index } from '../utils/general';


function TextureGlobe(props) {
    // var textureUrl = "https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe_dark.jpg";
    var textureUrl = "data:image/png;base64,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";
    return (
        <Globe
            globeImageUrl={textureUrl}
        />
    );
}

function CustomGlobe(props) {
    const globeEl = React.useRef();

    React.useEffect(() => {
        // custom globe material
        const globeMaterial = globeEl.current.globeMaterial();
        /*
        const globeMaterial = new THREE.MeshBasicMaterial(
            { color: 0xffffff, vertexColors: THREE.FaceColors } );
        */

        globeMaterial.bumpScale = 10;
        new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
            globeMaterial.specularMap = texture;
            globeMaterial.specular = new THREE.Color('grey');
            globeMaterial.shininess = 15;
        });

        setTimeout(() => { // wait for scene to be populated (asynchronously)
            const directionalLight = globeEl.current.scene().children.find(obj3d => obj3d.type === 'DirectionalLight');
            directionalLight && directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect
        });
    }, []);

    return <Globe
        ref={globeEl}
        globeImageUrl="https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe_dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
    />;
}

function TilesGlobe(props) {
    // const TILE_MARGIN = 0.35; // degrees
    const TILE_MARGIN = 0.0; // degrees

    // Gen random data
    // const GRID_SIZE = [60, 20];
    // const GRID_SIZE = [240, 120];
    // const GRID_SIZE = [120, 60];
    const GRID_SIZE = [60, 30];
    const COLORS = ['red', 'green', 'yellow', 'blue', 'orange', 'pink', 'brown', 'purple', 'magenta'];
    // const COLORS = [0xFFFFFF, 0xE4E4E4, 'yellow', 'blue', 'orange', 'pink', 'brown', 'purple', 'magenta'];

    const materials = COLORS.map(color => new THREE.MeshLambertMaterial({ color, opacity: 0.6, transparent: true }));
    // const materials = {};
    const tileWidth = 360 / GRID_SIZE[0];
    const tileHeight = 180 / GRID_SIZE[1];
    const tilesData = [];
    var width = props.width;
    for (var lngIdx = 0; lngIdx < GRID_SIZE[0]; lngIdx++) {
        for (var latIdx = 0; latIdx < GRID_SIZE[1]; latIdx++) {
            var tileIndex = xy2index(lngIdx, latIdx, width);
            tileIndex = tileIndex % props.tiles.length;
            // var color = 0x0000EA;
            var color = props.tiles[tileIndex];
            var material = new THREE.MeshLambertMaterial({ color, opacity: 0.6, transparent: true });
            // var material = materials[Math.floor(Math.random() * materials.length)];
            tilesData.push({
                lng: -180 + lngIdx * tileWidth,
                lat: -90 + (latIdx + 0.5) * tileHeight,
                material: material
            });
        }
    }
    return (
        <Globe
          tilesData={tilesData}
          tileWidth={tileWidth - TILE_MARGIN}
          tileHeight={tileHeight - TILE_MARGIN}
          tileMaterial="material"
          globeImageUrl={"https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe_dark.jpg"}
          tileCurvatureResolution={1}
          tileLabel={"cool"}
          onTileClick={(tile, event) => console.log(tile)}
        />
    );
}

export default TextureGlobe;
