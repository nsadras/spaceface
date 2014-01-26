var http = require('http');
var socketio = require('socket.io');
var express = require('express');
var process = require('process');
 
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server,{log:false});
server.listen(2701);
 
app.get('/',function(req,res){
    res.sendfile(__dirname + '/index.html');
});
 
var webcamData=-1;
io.sockets.on('connection', function (socket) {
    socket.emit('welcome',{});
    socket.on('getWebcamData', function (data) {
        socket.emit('webcamData',{data:webcamData});
    });
});
 
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
    chunkArr=chunk.trim().split("\n");
    webcamData = chunkArr[chunkArr.length-2]
});
