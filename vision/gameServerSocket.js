var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server,{log:false});
var visionData;

server.listen(7777,function(){console.log("asdf");});
app.get("/",function(req,res){
    res.sendfile(__dirname+"/webClientSocket.html");
})
io.sockets.on('connection', function (socket){
	socket.on("IamHere", function (data) {
		console.log("IamHere!");
		visionData = data["visionData"];
	});

	setInterval(function(){
		socket.emit("heartbeat", {"currentState": currentState(visionData)}); 
	},50);
});
function currentState(visionData)
{
	
}