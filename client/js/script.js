var socket;
var me;

var playground;
var ctx;

var players = [];
var resources = [];
var animals = [];
var buildings = [];


var playgroundSize = 10000;
var speed = 10;


function setup() {

    playground = document.getElementById("playground");

    resizePlayground();
    playgroundInit();

    socket = io.connect('192.168.1.107:80'); // change IP

    setInterval(tick, 20); //fps
    function tick() {
        moveMe();
        draw();
    }



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

    socket.on('move', function (data) {

        var i = players.findIndex(x => x.id === data.id);

        if (i !== -1) {
            players[i].x = data.x;
            players[i].y = data.y;
        }

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
        right = speed;
    }
    if (event.keyCode === 38) {
        down = speed;
    }
    if (event.keyCode === 39) {
        left = speed;
    }
    if (event.keyCode === 40) {
        up = speed;
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

    if (me.x <= 0) {
        left = 0;
    }
    if (me.y <= 0) {
        up = 0;
    }
    if (me.x >= playgroundSize) {
        right = 0;
    }
    if (me.y >= playgroundSize) {
        down = 0;
    }

    socket.emit("move", {x: me.x, y: me.y, id: me.id});

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
    drawMe();
    drawResources();

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
            ctx.font = "20px Arial";
            ctx.fillText(player.name, me.x - player.x, me.y - player.y + 7);

        }
    }
}

function drawResources() {

    for (var i = 0; i < resources.length; i++) {

        var resource = resources[i];

        if (resource.type === "Tree") {

            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(me.x - resource.x, me.y - resource.y, resource.size, 0, 2 * Math.PI);
            ctx.fill();

        } else if (resource.type === "Bush") {

            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(me.x - resource.x, me.y - resource.y, resource.size, 0, 2 * Math.PI);
            ctx.fill();

        } else if (resource.type === "Stone") {

            ctx.fillStyle = "gray";
            ctx.beginPath();
            ctx.arc(me.x - resource.x, me.y - resource.y, resource.size, 0, 2 * Math.PI);
            ctx.fill();

        }

    }
}
