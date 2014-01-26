var onRenderFcts= [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
camera.rotation.y=Math.PI;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMapEnabled  = true


onRenderFcts.push(function(){
    renderer.render( scene, camera );                
});


function hud(){
    $('body').append('<div id="hud"></div>');
}
hud();
function drawPlanets(){
    //Planetz
    var starfield = THREEx.Planets.createStarfield();
    scene.add(starfield);

    var sun = THREEx.Planets.createSun();
    sun.position.y -= 100;
    scene.add(sun);

    var mercury = THREEx.Planets.createMercury();
    mercury.position.y -= 200;
    scene.add(mercury);

    var neptune = THREEx.Planets.createNeptune();
    neptune.position.z += 130;
    scene.add(neptune);



    var jupiter = THREEx.Planets.createJupiter();
    jupiter.position.x += 300;
    scene.add(jupiter);

    //var rings = THREEx.Planets.createSaturnRing()
    //rings.position.x += 100;
    //scene.add(rings);

}

drawPlanets();

var spaceships = {}
function drawShip(pos, velocity, roll, bullet_list, sessionKey){ // don't do this at home kids
    
    if(sessionKey in spaceships){
        if (spaceships[sessionKey]){
            var curr_ship = spaceships[sessionKey];
            curr_ship.position = pos.clone();
            curr_ship.lookAt(pos.clone().add(velocity));
            curr_ship.rotateZ(roll);
        } 
    } else {
        console.log("Drawing "+sessionKey+" for the first time.");
        spaceships[sessionKey] = false;
        THREEx.SpaceShips.loadSpaceFighter03(function(object3d){
            spaceship   = object3d;
            spaceship.position = pos.clone();
            spaceship.lookAt(pos.clone().add(velocity));
            spaceship.rotateZ(roll);
            spaceships[sessionKey] = spaceship;
            scene.add(spaceship);
        });
    }
     
    for(var i = 0; i < bullet_list.length; i++){
        var curr_bullet = bullet_list[i];
        var bullet_pos = new THREE.Vector3(curr_bullet.px, curr_bullet.py, curr_bullet.pz);
        var bullet_velocity = new THREE.Vector3(curr_bullet.vx, curr_bullet.vy, curr_bullet.vz); 
        drawBullet(bullet_pos, bullet_velocity, curr_bullet.id);
    }

}

var bullets = {};
var enabled = {};
function drawBullet(pos, velocity, bulletID){
    if(bulletID in bullets){
        var curr_bullet = bullets[bulletID]
        curr_bullet.position = pos.clone();
        curr_bullet.lookAt(pos.clone().add(velocity));
        enabled[bulletID] = true; 
    } else {
        var bullet = new THREEx.SpaceShips.Shoot();
        bullet.position = pos.clone();
        bullet.lookAt(pos.clone().add(velocity));
        bullets[bulletID] = bullet;
        enabled[bulletID] = true;
        scene.add(bullet);
    }
}

function purgeBullets(){
    for(var bulletID in bullets){
        if(enabled[bulletID]){
            enabled[bulletID] = false;
        } else {
            scene.remove(bullets[bulletID]);
            delete bullets[bulletID];
            delete enabled[bulletID];
        }
    }
}



function orientCamera(sessionKey){
    var relativeCameraOffset = new THREE.Vector3(0,0,-15);

    var cameraOffset = relativeCameraOffset.applyMatrix4( spaceships[sessionKey].matrixWorld );

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( spaceships[sessionKey].position );
    camera.translateY(.5);
}

function destroy(sessionKey){ //ka-boom
    if(sessionKey in spaceships){
        scene.remove(spaceships[sessionKey]);
        delete spaceships[sessionKey]; 
    }
}



function drawSelf(pos, velocity, roll){
    spaceship.position = pos.clone();//new THREE.Vector3(position.x, position.y, position.z);;
    spaceship.lookAt(pos.clone().add(velocity)); 
    spaceship.rotateZ(roll);
    //console.log(roll);


    /**
    var relativeCameraOffset = new THREE.Vector3(0,0,-15);

    var cameraOffset = relativeCameraOffset.applyMatrix4( spaceship.matrixWorld );

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( spaceship.position );
    camera.translateY(.5);
    **/


    //var unit_velocity = velocity.clone().divideScalar(velocity.length());
    //console.log(unit_velocity);
    //camera.position = spaceship.position.clone().sub(unit_velocity.multiplyScalar(2));
    //camera.lookAt(spaceship.position);

    //camera.translateY(1);

}



var lastTimeMsec= null;
requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec        = lastTimeMsec || nowMsec-1000/60
    var deltaMsec        = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec        = nowMsec
    //update();
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
})

/**
  function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
//camera.rotation = spaceship.rotation;
//spaceship.position.z -= .01;
//camera.position.z -= .008
//spaceship.rotation.x += 0.1;
//spaceship.rotation.y += 0.02;
}
render();

 **/

