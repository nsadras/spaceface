var express = require('express')
var http = require('http')
var socketio = require('socket.io')
var constants = require('./gameServerAssets/constants.js').constants;

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server,{log:false});
server.listen(constants.port);
    
app.get('/',function(req,res){
    res.sendfile(__dirname + "/" + constants.assetsdir + "/html/index.html");
});

app.get('/*',function(req,res){
    res.sendfile(__dirname + "/"+ constants.assetsdir +"/" + req.params[0]);
});

io.sockets.on('connection',function(socket){
});
