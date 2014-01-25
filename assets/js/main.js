nose={x:0,y:0,shoot:false}

document.onmousemove=function(e){
    nose.x=(e.clientX/window.innerWidth)*2-1;
    nose.y=(1.0-e.clientY/window.innerHeight)*2-1;
}

var socket = io.connect("http://localhost:1759");
var sessionKey=-1;

socket.on('welcome',function(data){
    sessionKey=data.sessionKey
});

socket.on('heartbeat',function(data){
    if (sessionKey==-1){
        return;
    }
    var curr;
    for (var k in data){
        if (k == sessionKey){
        }else{
            curr = data[k]
            drawShip(new THREE.Vector3(curr.px,curr.py,curr.pz), new THREE.Vector3(curr.vx,curr.vy,curr.vz), curr.roll,k);
        }
    }
    curr = data[sessionKey]
    drawShip(new THREE.Vector3(curr.px,curr.py,curr.pz), new THREE.Vector3(curr.vx,curr.vy,curr.vz), curr.roll,sessionKey);
    orientCamera(sessionKey);
    socket.emit('command',{sessionKey:sessionKey,controls:{shoot:nose.shoot,displacement_x:nose.x,displacement_y:nose.y}});
});

socket.on('playerExit',function(data){
    destroy(data.sessionKey);
});

window.onbeforeunload = function() {
    socket.emit('exit',{sessionKey:sessionKey});
}
