var socket;
var player;

var playground;
var ctx;

var players = [];
var resources = [];
var animals = [];
var buildings = [];


function setup() {
    playground = document.getElementById("playground");

    resizePlayground();
    playgroundInit();

    socket = io.connect('localhost:80'); // change IP

    socket.on('tick', function () {
        draw();
    });

    socket.on('newPlayer', function (data) {

        player = new Player(data, "Já", (Math.floor(Math.random() * 1000)), Math.floor((Math.random() * 1000)), "type", 100, 0);

        socket.emit('newPlayer', player);

    });

    socket.on('players', function (data) {

        players = data;

    });
    socket.on('animals', function (data) {

        animals = data;

    });
    socket.on('buildings', function (data) {

        buildings = data;

    });
    socket.on('resources', function (data) {

        resources = data;

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



function resizePlayground() {
    playground.height = window.innerHeight;
    playground.width = window.innerWidth;
}

function playgroundInit() {

    ctx = playground.getContext("2d");
    ctx.translate(window.innerWidth / 2, window.innerHeight / 2); //set center 0 0

}

function draw() {

    ctx.clearRect(-(window.innerWidth / 2), -(window.innerHeight / 2), window.innerWidth, window.innerHeight); //clear canvas

    drawPlayer(0, 0, player.name);
    drawDummy(50, 50);
}

function drawPlayer(x, y, name) {

    ctx.fillStyle = "#ffcc00";

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "black";

    ctx.font = "20px Georgia";
    ctx.fillText(name, x, y);

}

function drawDummy(x, y) {
    ctx.fillStyle = "brown";

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();
}

