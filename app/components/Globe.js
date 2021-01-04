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
        /*
        const ctx = document.createElement('canvas').getContext('2d');
        const canvas = ctx.canvas;
        ctx.canvas.width = 512;
        ctx.canvas.height = 256;
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // draw some stuff in there
        for (var k = 0; k < 10; k++) {
            drawRandomDot(ctx);
        }
        var dataUrl = canvas.toDataURL("image/png");
        console.log(dataUrl);

        const texture = new THREE.CanvasTexture(ctx.canvas);
        */
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

        /*
        var animate = function () {
            requestAnimationFrame( animate );
            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            // renderer.render( scene, camera );
            texture.needsUpdate = true;
        };
        animate();
        */
        // return () => clearTimeout(timer); // gets run on unmount

    }, []);

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
    return (
        <>
            <Globe
                ref={globeEl}
                backgroundColor={"#000011"}
                globeImageUrl="https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe_dark.jpg"
            />
            <canvas
                ref={canvasRef}
                {...rest}
            />
        </>
    );
}

export default CanvasGlobe;
