var onRenderFcts= [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.y=Math.PI;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var spaceship;

THREEx.SpaceShips.loadSpaceFighter03(function(object3d){
    spaceship   = object3d
    scene.add(spaceship)
    //drawSelf(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1), 0);
});

//var skyBox = new THREE.CubeGeometry(10000,10000,10000);
//var skyMaterial = new THREE.MeshBasicMaterial({color:0x9999ff})
//    var sky = new THREE.Mesh(skyBox,skyMaterial);
//    scene.add(sky);

    var floorMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00 } );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    camera.position.z = 2;
    camera.position.y = 1;
    //var mouse  = {x : 0, y : 0}
    /**document.addEventListener('mousemove', function(event){
        mouse.x        = (event.clientX / window.innerWidth ) - 0.5
        mouse.y        = (event.clientY / window.innerHeight) - 0.5
    }, false)
**/
// testing loopy stuff
//onRenderFcts.push(function(delta, now){

    //spaceship.position.y += .03;
    //camera.lookAt(spaceship.position);    
    //spaceship.rotation.y += .02;
    //spaceship.rotation.x += -(mouse.y*5 - camera.position.y) * (delta*3)
    //spaceship.rotation.y += (mouse.y*5 - camera.position.y) * (delta*3)
    //camera.lookAt( scene.position )
//});


//onRenderFcts.push(function(delta, now){
    //var mydirection = new THREE.Vector3(Math.cos(spaceship.rotation.x), Math.cos(spaceship.rotation.y), Math.cos(spaceship.rotation.z));
    //camera.position = spaceship.position.sub(mydirection.multiplyScalar(10));
    //camera.rotation = spaceship.rotation;
    //camera.lookAt(spaceship.position);
//});

onRenderFcts.push(function(){
    renderer.render( scene, camera );                
});


var spaceships = {}
function drawShip(pos, velocity, roll, sessionKey){ // don't do this at home kids
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


function drawBullet(pos, velocity){
    var bullet = new THREEx.SpaceShips.Shoot()
        bullet.position = pos.clone()
        bullet.lookAt(pos.clone().add(velocity));
    scene.add(bullet) 
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

