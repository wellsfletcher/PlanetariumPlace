import React from 'react';

import * as THREE from "three";
import Globe from 'react-globe.gl';
import { int2hexcolor, xy2index } from '../utils/general';



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
    /*
    [...Array(GRID_SIZE[0]).keys()].forEach(lngIdx => {
        [...Array(GRID_SIZE[1]).keys()].forEach(latIdx => {
            tilesData.push({
                lng: -180 + lngIdx * tileWidth,
                lat: -90 + (latIdx + 0.5) * tileHeight,
                material: materials[Math.floor(Math.random() * materials.length)]
            });
        });
    });
    */
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

export default TilesGlobe;
