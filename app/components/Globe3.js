import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
// import OrbitControls from 'three-orbitcontrols';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { WindowResize } from "three/examples/jsm/controls/THREEx.WindowResize.js"
import { int2hexcolor, xy2index, index2vector, mod } from '../utils/general';

/*
class ClickGlobe extends Component {
  componentDidMount() {
      // === THREE.JS CODE START ===
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      // document.body.appendChild( renderer.domElement );
      this.mount.appendChild(renderer.domElement);

      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );
      camera.position.z = 5;
      var animate = function () {
        requestAnimationFrame( animate );
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render( scene, camera );
      };
      animate();
      // === THREE.JS EXAMPLE CODE END ===
  }
  render() {
      return <div ref={ref => (this.mount = ref)} />;
  }
}
*/

const arePropsEquals = (prevProps, nextProps) => {
    // there seems to be noticable performance increase when this just returns false
    // return prevProps === nextProps;
    // return false;
    return prevProps.brushColor === nextProps.brushColor;
};

const ClickGlobe = React.memo((props) => {
    var tiles = props.tiles;
    var width = props.width;
    var height = tiles.length / width;

    var mount = React.useRef(null);
    // const [onClick, setOnClick] = React.useState((event) => {});
    // var onClick = React.useRef();

    console.log("rerendered");
    var sceneRef = React.useRef();
    var cameraRef = React.useRef();
    var projectorRef = React.useRef();
    var targetListRef = React.useRef([]);
    React.useEffect(() => {
        var scene, camera;
        var projector;
        var targetList = [];
        // var onClickTemp;
        // === THREE.JS CODE START ===
        // SCENE
        scene = new THREE.Scene();
        // CAMERA
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        camera.position.set(0,150,400);
	    camera.lookAt(scene.position);

        // RENDERER
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        // document.body.appendChild( renderer.domElement );
        mount.appendChild(renderer.domElement);
        // CONTROLS
        // var controls = new THREE.OrbitControls( camera, renderer.domElement );
        var controls = new OrbitControls( camera, renderer.domElement );
        // LIGHT
        var light = new THREE.PointLight(0xffffff);
        light.position.set(0,250,0);
        scene.add(light);
        const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add(ambientLight);
        const hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        hemiLight.position.set(0,400,0);
        scene.add(hemiLight);

        // SKYBOX/FOG
    	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    	scene.add(skyBox);

        // CUSTOM
        var faceColorMaterial = new THREE.MeshLambertMaterial(
    	{ color: 0xffffff, vertexColors: THREE.FaceColors } );


    	// var sphereGeometry = new THREE.SphereGeometry( 80, 32, 16 );
        // var sphereGeometry = new THREE.SphereGeometry( 80, 1024, 512 );
        var sphereGeometry = new THREE.SphereGeometry( 80, 512, 256 ); // width, height
    	for ( var i = 0; i + 1 < sphereGeometry.faces.length; i += 2 ) {
    		var leftFace = sphereGeometry.faces[ i ];
            var rightFace = sphereGeometry.faces[ i + 1 ];
    		// face.color.setRGB( 0, 0, 0.8 * Math.random() + 0.2 );
            var color = tiles[i % tiles.length];
            leftFace.color.setHex(color);
            rightFace.color.setHex(color);
    	}
        /*
        for ( var i = 0; i < sphereGeometry.faces.length; i++ ) {
    		var face = sphereGeometry.faces[ i ];
    		face.color.setRGB( 0, 0, 0.8 * Math.random() + 0.2 );
    	}
        */
    	var sphere = new THREE.Mesh( sphereGeometry, faceColorMaterial );
    	sphere.position.set(0, 0, 0);
    	scene.add(sphere);

    	targetList.push(sphere);
        projector = new THREE.Raycaster();


        /*
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var color = 0x00bbbb;
        var material = new THREE.MeshLambertMaterial({ color, opacity: 0.6, transparent: true });

        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        */

        // setOnClick(onClickTemp);
        //- onClick.current = onClickTemp;
        // camera.position.z = 5;

        sceneRef.current = scene;
        cameraRef.current = camera;
        projectorRef.current = projector;
        targetListRef.current = targetList;

        var animate = function () {
            requestAnimationFrame( animate );
            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            renderer.render( scene, camera );
        };
        animate();

        // renderer.render( scene, camera );
        // === THREE.JS EXAMPLE CODE END ===
    }, []); // empty brackets means is only run once

    var onClick = (event) => {
        // console.log("Click.");
        var scene = sceneRef.current;
        var camera = cameraRef.current;
        var projector = projectorRef.current;
        var targetList = targetListRef.current;

        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var mouse = {x: x, y: y};

        // update the picking ray with the camera and mouse position
        // console.log(mouse);
        // console.log(camera);
        // console.log(projector); // projector breaks as soon as camera is changed
        projector.setFromCamera( mouse, camera );

        // calculate objects intersecting the picking ray
        const intersects = projector.intersectObjects( targetList );

        if (intersects.length > 0) {
            // console.log("Hit @ " + toString( intersects[0].face ) );
            // console.log(intersects[0]);
            // change the color of the closest face.
            // intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 );

            var hitObject = intersects[ 0 ].object;
            var hitFace = intersects[ 0 ].face;
            var hitFaceIdx = intersects[ 0 ].faceIndex;
            var faces = hitObject.geometry.faces;
            // left corner is always odd
            // right corner is always even
            var adjacentFaceIdx = 0;
            if (hitFaceIdx % 2 != 0) {
                // right corner
                adjacentFaceIdx = hitFaceIdx - 1;
            } else {
                // left corner
                adjacentFaceIdx = hitFaceIdx + 1;
            }
            // const adjacentFace = faces[adjacentFaceIdx];
            const adjacentFace = faces[mod(adjacentFaceIdx, faces.length)]; // should technically be math mod

            // adjacentFace.color.setRGB( 0.8, 0, 0 );
            // hitFace.color.setRGB( 0.8, 0, 0 );
            adjacentFace.color.setHex( props.brushColor );
            hitFace.color.setHex( props.brushColor );
            hitObject.geometry.colorsNeedUpdate = true;
            // intersects[ 0 ].face.color.setRGB( 0.8, 0, 0 );
            // intersects[ 0 ].object.geometry.colorsNeedUpdate = true;

            // var index = (hitFaceIdx % width) % tiles.length;
            // var index = hitFaceIdx % tiles.length;
            var index = (hitFaceIdx / 2) % tiles.length;
            // var vector = {x: 3, y: 3};
            var vector = index2vector(index, width);
            props.setTile(vector, props.brushColor);
        }
    }

    // return <div ref={mount} />;
    // ref={ref => (mount = ref)}
    // onClick={onClick}
    // onMouseMove={onClick}
    // onMouseMove={(event) => onClick(event)}
    return (
        <div
            ref={ref => (mount = ref)}
            onClick={onClick}
        />
    );
}, arePropsEquals);

export default ClickGlobe;
