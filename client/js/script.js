function init() {
    resizePlayground();

    var socket = io.connect('localhost:80');

    var players;
    var resources;
    var animals;
    var buildings;

}


window.onresize = function () {
    resizePlayground();
};



function resizePlayground() {
    var playground = document.getElementById("playground");
    playground.height = window.innerHeight;
    playground.width = window.innerWidth;
}

