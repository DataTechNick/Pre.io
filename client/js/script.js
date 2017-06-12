var socket;
var me;

var playground;
var ctx;

var players = [];
var resources = [];
var animals = [];
var buildings = [];


var playgroundSize = 10000;


function setup() {

    playground = document.getElementById("playground");

    resizePlayground();
    playgroundInit();

    socket = io.connect('localhost:80'); // change IP

    socket.on('tick', function () {

        moveMe();
        draw();

    });

    socket.on('newPlayer', function (data) {

        me = new Player(data, "Já", (Math.floor(Math.random() * 1000)), Math.floor((Math.random() * 1000)), "type", 100, 0);
        socket.emit('newPlayer', me);
    });

    socket.on('players', function (data) {

        players = data;
        console.log(players);
    });

    socket.on('animals', function (data) {

        animals = data;
        console.log(animals);
    });

    socket.on('buildings', function (data) {

        buildings = data;
        console.log(buildings);
    });

    socket.on('resources', function (data) {

        resources = data;
        console.log(resources);
    });

    socket.on('addPlayer', function (data) {

        players.push(data);
    });

    socket.on('removePlayer', function (id) {

        var index = players.findIndex(x => x.id === id);
        players.splice(index, 1);

    });
    
}





window.onresize = function () {

    resizePlayground();
    playgroundInit();

};

var left = 0;
var right = 0;
var up = 0;
var down = 0;

document.addEventListener("keydown", function (event) {
    event.preventDefault();
    if (event.keyCode === 37) {
        right = 10;
    }
    if (event.keyCode === 38) {
        down = 10;
    }
    if (event.keyCode === 39) {
        left = 10;
    }
    if (event.keyCode === 40) {
        up = 10;
    }
});

document.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 37) {
        right = 0;
    }
    if (event.keyCode === 38) {
        down = 0;
    }
    if (event.keyCode === 39) {
        left = 0;
    }
    if (event.keyCode === 40) {
        up = 0;
    }
});

function moveMe() {
    me.x += right;
    me.y += down;
    me.x -= left;
    me.y -= up;

}





function resizePlayground() {

    playground.height = window.innerHeight;
    playground.width = window.innerWidth;

}

function playgroundInit() {

    ctx = playground.getContext("2d");

    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);

}

function draw() {

    ctx.clearRect(-(window.innerWidth / 2), -(window.innerHeight / 2), window.innerWidth, window.innerHeight);

    drawPlayers();
    drawDummies();
    drawMe();

}

function drawMe() {

    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "20px Arial";
    ctx.fillText(me.name, 0, 7);

}

function drawPlayers() {

    for (var i = 0; i < players.length; i++) {

        var player = players[i];

        if (player.id !== me.id) {

            ctx.fillStyle = "#ffcc00";
            ctx.beginPath();
            ctx.arc(me.x - player.x, me.y - player.y, 30, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "20px Georgia";
            ctx.fillText(player.name, me.x - player.x, me.y - player.y + 7);

        }
    }
}

function drawDummies() {

    for (var i = 0; i < resources.length; i++) {

        var dummy = resources[i];
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(me.x - dummy.x, me.y - dummy.y, 15, 0, 2 * Math.PI);
        ctx.fill();
    }
}

