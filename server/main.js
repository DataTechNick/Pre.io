var http = require('http'),
    fs = require('fs');

var server = http.createServer(function (req, res) {

    if(req.url === '/'){ //req.url has the pathname, check if it conatins '.html'

      fs.readFile('../client/index.html', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('script.js') !== -1){ //req.url has the pathname, check if it conatins '.js'

      fs.readFile('../client/js/script.js', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('style.css') !== -1){ //req.url has the pathname, check if it conatins '.css'

      fs.readFile('../client/css/style.css', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });

    }

}).listen(80, 'localhost');

console.log("localhost:80");

var io = require('socket.io').listen(server);


var players;
var resources;
var animals;
var buildings;



io.on('connect', function (socket) {
    
    
    
    console.log(socket.id);
 
    socket.on('message', function (message) {
        console.log(message);
       
        io.sockets.emit('message', message);
    });
    
    
    socket.on('disconnect', function(){
       console.log("User left us.");
    });
    
});

