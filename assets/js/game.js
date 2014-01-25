
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var spaceship;

THREEx.SpaceShips.loadSpaceFighter03(function(object3d){
    spaceship   = object3d
    scene.add(spaceship)
});

camera.position.z = 3;
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    //spaceship.rotation.x += 0.1;
    spaceship.rotation.y += 0.02;
}
render();


