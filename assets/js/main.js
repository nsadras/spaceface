var LPF_ORDER=20;
nose_x_cache=[];
nose_y_cache=[];
nose={x:0,y:0,shoot:false,dist:0.0}

document.onmousemove=function(e){
    nose.x=(e.clientX/window.innerWidth)*2-1;
    nose.y=(1.0-e.clientY/window.innerHeight)*2-1;
}
document.onmousedown=function(e){
    nose.shoot=true
}
document.onmouseup=function(e){
    nose.shoot=false
}

var socket = io.connect("http://localhost:1759");
var visionSocket = io.connect("http://localhost:2701");
var sessionKey=-1;

socket.on('welcome',function(data){
    sessionKey=data.sessionKey;
});

visionSocket.on('welcome',function(data){
    setInterval(function(){ visionSocket.emit("getWebcamData") }, 25);
    visionSocket.on('webcamData', function(data){
        var parsed = window.JSON.parse(data.data);
        nose.shoot = parsed["fire"];
        nose.dist=parsed["dist"];
        nose_x_cache.push(parsed["x"]);
        nose_y_cache.push(parsed["y"]);
	      if (nose_x_cache.length>LPF_ORDER){
	          nose_x_cache=nose_x_cache.slice(1);
	      }
	      if (nose_y_cache.length>LPF_ORDER){
	          nose_y_cache=nose_y_cache.slice(1);
	      }
	      nose.x=0.0;
        nose.y=0.0;
        for(var i = 0; i < nose_x_cache.length; i++){
	          nose.x+=nose_x_cache[i];
	      }
	      nose.x/=nose_x_cache.length;
        for(var i = 0; i < nose_y_cache.length; i++){
	          nose.y+=nose_y_cache[i];
	      }
	      nose.y/=nose_y_cache.length;
    });
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
            drawShip(new THREE.Vector3(curr.px,curr.py,curr.pz), new THREE.Vector3(curr.vx,curr.vy,curr.vz), curr.roll, curr.bullets, k);
        }
    }
    curr = data[sessionKey]
    drawShip(new THREE.Vector3(curr.px,curr.py,curr.pz), new THREE.Vector3(curr.vx,curr.vy,curr.vz), curr.roll, curr.bullets, sessionKey);
    orientCamera(sessionKey);
    purgeBullets(); //begone, foul demon
    socket.emit('command',{sessionKey:sessionKey,controls:{dist: nose.dist,shoot:nose.shoot,displacement_x:nose.x,displacement_y:nose.y}});
});

socket.on('playerExit',function(data){
    destroy(data.sessionKey);
});

window.onbeforeunload = function() {
    socket.emit('exit',{sessionKey:sessionKey});
}
