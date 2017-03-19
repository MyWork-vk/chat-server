var express = require('express');
global.mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');


var app = express();

app.use(function(req, res, next) {
  var allowedOrigins = ['http://127.0.0.1:8020','http://192.168.43.90:8101','http://192.168.43.90:8102', 'http://localhost:8100','http://192.168.43.90:8100', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');


var router = express.Router();


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get('/', function(req, res){
	res.send("<h1>Welcome</h1>");
});

io.on('connection', function(socket){



  socket.on('join:chat', function(data){
    var user_id = data.chat_name;
    socket.join(user_id);
  });

  socket.on('send:chat_message', function(msg){
		socket.in(msg.chat).emit(msg.chat, msg);
	});

  socket.on('join:room', function(data){
		var room_name = data.room_name;
		socket.join(room_name);
    console.log(room_name);
	});


	socket.on('leave:room', function(msg){
		msg.text = msg.user + ' has left the room';
		socket.leave(msg.room);
		socket.in(msg.room).emit('message', msg);
    console.log(msg.text);
	});


	socket.on('send:message', function(msg){
		socket.in(msg.room).emit('message', msg);
    console.log(msg);
	});


});
