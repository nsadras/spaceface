var express = require('express')
var http = require('http')
var socketio = require('socket.io')
var constants = require('./gameServerAssets/constants.js').constants;
var GameState = require('./gameServerAssets/GameState.js').GameState;

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server,{log:false});
server.listen(constants.port,function(){
    console.log("Server started on port " + constants.port +"\nPress ctrl-c to exit.")
});
    
/////////////////////
//HTTP Server stuff//
/////////////////////

app.get('/',function(req,res){
    res.sendfile(__dirname + "/" + constants.assetsdir + "/html/index.html");
});
app.get('/*',function(req,res){
    res.sendfile(__dirname + "/"+ constants.assetsdir +"/" + req.params[0]);
});

//////////////////
//GameState Code//
//////////////////

//Set up individual connections
var state = new GameState();
io.sockets.on('connection',function(socket){
    var sessionKey = makeSessionKey();
    socket.emit('welcome',{sessionKey:sessionKey});
    socket.on('command',function(data){
        state.setControls(data.sessionKey,data.controls);
    });
    state.addPlayer(sessionKey);
});

//Start game heartbeat
setInterval(function(){
    io.sockets.emit('heartbeat',state.digest());
    state.update();
},constants.gameRefresh);

////////////////////
//Helper Functions//
////////////////////

var nextKey=0
function makeSessionKey(){
    return nextKey++;
}
