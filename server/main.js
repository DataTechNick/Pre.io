// nodepack

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

}).listen(80, '192.168.10.232');

console.log("192.168.10.232:80");

var io = require('socket.io').listen(server);

var socket;

var players = [];
var resources = [];
var animals = [];
var buildings = [];

var playgroundSize = 10000;


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



console.log("Growing trees");

var i = 0;
while (i < 300) {

    var x = Math.floor(Math.random() * playgroundSize);
    var y = Math.floor(Math.random() * playgroundSize);
    var size = Math.floor(Math.random() * 70) + 40;

    var res = new Resource(resources.length + 1, x, y, "Tree", size);

    console.log(resources.length);

    if (resources.findIndex(item => Math.sqrt(Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2)) < item.size + size - 20) === -1) {

        resources.push(res);

        i++;

    }

}

console.log("Planting bushes");

i = 0;
while (i < 200) {

    var x = Math.floor(Math.random() * playgroundSize);
    var y = Math.floor(Math.random() * playgroundSize);
    var size = Math.floor(Math.random() * 40) + 20;

    res = new Resource(resources.length + 1, x, y, "Bush", size);

    console.log(resources.length);

    if (resources.findIndex(item => Math.sqrt(Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2)) < item.size + size - 20) === -1) {

        resources.push(res);

        i++;

    }

}

console.log("Placing stone");

i = 0;
while (i < 600) {

    var x = Math.floor(Math.random() * playgroundSize);
    var y = Math.floor(Math.random() * playgroundSize);
    var size = Math.floor(Math.random() * 60) + 30;

    res = new Resource(resources.length + 1, x, y, "Stone", size);

    console.log(resources.length);

    if (resources.findIndex(item => Math.sqrt(Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2)) < item.size + size - 20) === -1) {

        resources.push(res);

        i++;

    }
}





io.on('connect', function (socket) {

    console.log("New player connected " + socket.id);

    socket.emit('newPlayer', socket.id);

    socket.on('newPlayer', function (data) {

        players.push(data);

        socket.emit('players', players);
        socket.emit('animals', animals);
        socket.emit('buildings', buildings);
        socket.emit('resources', resources);

        socket.broadcast.emit('addPlayer', data);

    });

    socket.on('move', function (data) {

        socket.broadcast.emit('move', data);

        var i = players.findIndex(x => x.id === data.id);

        if (i !== -1) {
            players[i].x = data.x;
            players[i].y = data.y;
        }

    });

    socket.on('disconnect', function () {

        console.log("Player disconnected " + socket.id);

        var index = players.findIndex(x => x.id === socket.id);
        players.splice(index, 1);

        io.emit('removePlayer', socket.id);

    });

});


