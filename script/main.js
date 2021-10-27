import * as THREE from '/lib/three.module.js';

import Stats from '/lib/stats.module.js';

import { OrbitControls } from '/lib/OrbitControls.js';
import { VRMLLoader } from '/lib/VRMLLoader.js';
import { GUI } from '/lib/dat.gui.module.js';

let camera, scene, renderer, stats, controls, loader;

var hash = window.location.hash
var asset = hash.length > 1 ? hash.substr(1, hash.length) : 'index'

let vrmlScene;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1e10 );
    camera.position.set( - 10, 5, 10 );

    scene = new THREE.Scene();
    scene.add( camera );

    // light

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    dirLight.position.set( 200, 200, 200 );
    scene.add( dirLight );

    loader = new VRMLLoader();
    loadAsset(asset);

    // renderer

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // controls

    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 1;
    controls.maxDistance = 200;
    controls.enableDamping = true;

    //

    stats = new Stats();
    document.body.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize );
}

function loadAsset( asset ) {

    loader.load( `/model/${asset}.wrl`, function ( object ) {
        vrmlScene = object;
        scene.add( object );
        controls.reset();
    } );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    controls.update(); // to support damping

    renderer.render( scene, camera );

    stats.update();

}