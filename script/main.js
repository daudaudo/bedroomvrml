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

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5);
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff, .8 );
    dirLight.position.set( 200, 200, 200 );
    scene.add( dirLight );

    let gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);

    loader = new VRMLLoader();
    loadAsset(asset);

    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
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
    const gui = new GUI( { width: 300 } );
    window.onhashchange = () => {
        if ( vrmlScene ) {
            vrmlScene.traverse( function ( object ) {

                if ( object.material ) object.material.dispose();
                if ( object.material && object.material.map ) object.material.map.dispose();
                if ( object.geometry ) object.geometry.dispose();

            } );
            scene.remove( vrmlScene );
        }
        hash = window.location.hash
        loadAsset( hash.length > 1 ? hash.substr(1, hash.length) : 'index' );
    }
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