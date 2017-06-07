var http = require('http'),
        fs = require('fs');

var server = http.createServer(function (req, res) {

    if (req.url === '/') {

        fs.readFile('../client/index.html', function (err, data) {
            if (err)
                console.log(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });

    }

    if (req.url.indexOf('script.js') !== -1) {

        fs.readFile('../client/js/script.js', function (err, data) {
            if (err)
                console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });

    }
    
    if (req.url.indexOf('Player.js') !== -1) {

        fs.readFile('../client/js/Player.js', function (err, data) {
            if (err)
                console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });

    }
    
    if (req.url.indexOf('Resource.js') !== -1) {

        fs.readFile('../client/js/Resource.js', function (err, data) {
            if (err)
                console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });

    }
    
    if (req.url.indexOf('Animal.js') !== -1) {

        fs.readFile('../client/js/Animal.js', function (err, data) {
            if (err)
                console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });

    }
    
    if (req.url.indexOf('Building.js') !== -1) {

        fs.readFile('../client/js/Building.js', function (err, data) {
            if (err)
                console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });

    }

    if (req.url.indexOf('style.css') !== -1) {

        fs.readFile('../client/css/style.css', function (err, data) {
            if (err)
                console.log(err);
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });

    }

}).listen(80, 'localhost');

console.log("localhost:80");

var io = require('socket.io').listen(server);


var players = [];
var resources = [];
var animals = [];
var buildings = [];

function Player(id, name, x, y, type, hp, lvl) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.type = type;
    this.hp = hp;
    this.lvl = lvl;
}

function Resource(id, x, y, type, size) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
}

function Animal(id, x, y, type, hostile, hp, lvl) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.hostile = hostile;
    this.hp = hp;
    this.lvl = lvl;
}

function Building(id, x, y, type, hp, lvl) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.hp = hp;
    this.lvl = lvl;
}


setInterval(tick, 16);
function tick() {
    io.sockets.emit('tick', true);
}


io.on('connect', function (socket) {

    console.log(socket.id);
    
    socket.on('newPlayer', function (data) {
        console.log(data);
        
        players.push(data);

        io.sockets.emit('message', message);
    });


    socket.on('disconnect', function () {
        console.log("User left us.");
    });

});


