
/*
    Three.js "tutorials by example"
    Author: Lee Stemkoski
    Date: July 2013 (three.js v59dev)
*/

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;

init();
animate();

// FUNCTIONS        
function init() 
{
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,150,400);
    camera.lookAt(scene.position);  
    // RENDERER
   // if ( Detector.webgl )
        renderer = new THREE.WebGLRenderer();
    //else
     //   renderer = new THREE.CanvasRenderer(); 
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    //container = document.getElementById( 'ThreeJS' );
    document.body.appendChild( renderer.domElement );
    // EVENTS
    //THREEx.WindowResize(renderer, camera);
    //THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

    // CONTROLS
    // MUST REMOVE THIS LINE!!!
    // controls = ...

    // STATS
    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    scene.add(light);
    // FLOOR
    var floorMaterial = new THREE.MeshBasicMaterial( { color:0x00ff00} );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    scene.add(skyBox);
    scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
    
    ////////////
    // CUSTOM //
    ////////////
    
    // create an array with six textures for a cool cube
    //var MovingCube;
    THREEx.SpaceShips.loadSpaceFighter03(function(object3d){
        MovingCube   = object3d
        scene.add(MovingCube)
        //drawSelf(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1), 0);
    });

    //scene.add( MovingCube );    
    
}

var MovingCube;

function animate() 
{
    requestAnimationFrame( animate );
    render();       
    update();
}

function update()
{
    var delta = clock.getDelta(); // seconds.
    var moveDistance = 20 * delta; // 200 pixels per second
    var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
    
    // local transformations

    // move forwards/backwards/left/right
    if ( keyboard.pressed("W") )
        MovingCube.translateZ( -moveDistance );
    if ( keyboard.pressed("S") )
        MovingCube.translateZ(  moveDistance );
    if ( keyboard.pressed("Q") )
        MovingCube.translateX( -moveDistance );
    if ( keyboard.pressed("E") )
        MovingCube.translateX(  moveDistance ); 

    // rotate left/right/up/down
    var rotation_matrix = new THREE.Matrix4().identity();
    if ( keyboard.pressed("A") )
        MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    if ( keyboard.pressed("D") )
        MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
    if ( keyboard.pressed("R") )
        MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
    if ( keyboard.pressed("F") )
        MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
    
    if ( keyboard.pressed("Z") )
    {
        MovingCube.position.set(0,25.1,0);
        MovingCube.rotation.set(0,0,0);
    }
    
    var relativeCameraOffset = new THREE.Vector3(0,5,-20);

    var cameraOffset = relativeCameraOffset.applyMatrix4( MovingCube.matrixWorld );

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( MovingCube.position );
    
    //camera.updateMatrix();
    //camera.updateProjectionMatrix();
            
}

function render() 
{
    renderer.render( scene, camera );
}
