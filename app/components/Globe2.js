import React from 'react';

import * as THREE from "three";
import Globe from 'react-globe.gl';
import { int2hexcolor, xy2index } from '../utils/general';


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

export default CustomGlobe;
