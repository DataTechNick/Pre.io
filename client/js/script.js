var socket;

var players = [];
var resources = [];
var animals = [];
var buildings = [];


function setup() {
    resizePlayground();
    reDraw();

    socket = io.connect('localhost:80'); // change IP

    socket.on("newPlayer", function (data) {

        var player = new Player(data, "Já", (Math.floor(Math.random() * 1000)), Math.floor((Math.random() * 1000)), "type", 100, 0);

        socket.emit("newPlayer", player);

    });
    
}


//socket.on("tick", function () {
//    reDraw();
//});

window.onresize = function () {
    resizePlayground();
};



function resizePlayground() {
    var playground = document.getElementById("playground");
    playground.height = window.innerHeight;
    playground.width = window.innerWidth;
}

function reDraw() {

}

