function init(){
    resizePlayground();
}

//action------------------------------------------------------------------------

window.onresize = function () {
    resizePlayground();
};


//function----------------------------------------------------------------------

function resizePlayground(){
    var playground = document.getElementById("playground");
    playground.height = window.innerHeight;
    playground.width = window.innerWidth;
}

