var Game = function () {
    var socket;
    var me;

    var playground;
    var pg;

    var players = [];
    var resources = [];
    var animals = [];
    var buildings = [];

    var meResources = {wood: 0, stone: 0, weed: 0, leather: 0, food: 0};



    var playgroundSize = 10000;
    var speed = 10;


    this.setup = function (name) {

        var name = name;

        playground = document.getElementById("playground");

        resizePlayground();
        playgroundInit();

        socket = io.connect('192.168.1.107:80'); // change IP

        setInterval(tick, 20); //fps
        function tick() {
            updateMe();
            draw();
        }



        socket.on('newPlayer', function (data) {

            me = new Player(data, name, Math.floor(Math.random() * playgroundSize), Math.floor(Math.random() * playgroundSize), "type", 100, 0);

            var i = 0;
            while (i < resources.length) {

                console.log(i);

                if (detectColision(me, resources[i])) {

                    me.x = Math.floor(Math.random() * playgroundSize);
                    me.y = Math.floor(Math.random() * playgroundSize);

                    i = 0;

                } else {
                    i++;
                }

            }

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

    };





    window.onresize = function () {

        resizePlayground();
        playgroundInit();

    };

    var left = 0;
    var right = 0;
    var up = 0;
    var down = 0;

    var getWood = 0;
    var getStone = 0;
    var getWeed = 0;
    var getLeather = 0;
    var getFood = 0;

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

    document.addEventListener("onmousedown", function (event) {
        event.preventDefault();

//        console.log(event.clientX);
//        console.log(event.clientY);
//        console.log(window.innerHeight);
//        console.log(window.innerWidth);

console.log("ahoj");

        console.log(resources.indexOf(res => Math.sqrt(Math.pow(res.x - me.x, 2) + Math.pow(res.y - me.y, 2)) <= res.size + 30 + 30));

        getWood = 0;
        getStone = 0;
        getWeed = 0;
        getLeather = 0;
        getFood = 0;

    });

    document.addEventListener("onmouseup", function (event) {
        event.preventDefault();

        getWood = 0;
        getStone = 0;
        getWeed = 0;
        getLeather = 0;
        getFood = 0;

    });







    function updateMe() {

        addResources(getWood, getStone, getWeed, getLeather, getFood);

        var oldX = me.x;
        var oldY = me.y;

        if (me.x <= 0) {

            left = 0;
            me.x = 0;

        }
        if (me.y <= 0) {

            up = 0;
            me.y = 0;

        }
        if (me.x >= playgroundSize) {

            right = 0;
            me.x = playgroundSize;

        }
        if (me.y >= playgroundSize) {

            down = 0;
            me.y = playgroundSize;

        }

        socket.emit("move", {x: me.x, y: me.y, id: me.id});

        me.x += right;
        me.y += down;
        me.x -= left;
        me.y -= up;

        for (var i in resources) {

            if (detectColision(me, resources[i])) {

                countCorrectPosition(me, resources[i], oldX, oldY);

                me.x = oldX;
                me.y = oldY;

            }

        }

    }

    function detectColision(me, res) {

        return Math.sqrt(Math.pow(res.x - me.x, 2) + Math.pow(res.y - me.y, 2)) <= res.size + 30;

    }

    function countCorrectPosition(me, res, oldX, oldY) {

        var sX = me.x - oldX;
        var sY = me.y - oldY;



    }





    var addResources = function (wood, stone, weed, leather, food) {

        meResources.wood += wood;
        meResources.stone += stone;
        meResources.weed += weed;
        meResources.leather += leather;
        meResources.food += food;

        $("#wood").text(meResources.wood);
        $("#stone").text(meResources.stone);
        $("#weed").text(meResources.weed);
        $("#leather").text(meResources.leather);
        $("#food").text(meResources.food);

    }

    function resizePlayground() {

        playground.height = window.innerHeight;
        playground.width = window.innerWidth;

    }

    function playgroundInit() {

        pg = playground.getContext("2d");

        pg.translate(window.innerWidth / 2, window.innerHeight / 2);

    }

    function draw() {

        pg.clearRect(-(window.innerWidth / 2), -(window.innerHeight / 2), window.innerWidth, window.innerHeight);

        drawMiniMap();
        drawPlayers();
        drawMe();
        drawResources();

    }

    function drawMe() {

        pg.fillStyle = "#ffcc00";
        pg.beginPath();
        pg.arc(0, 0, 30, 0, 2 * Math.PI);
        pg.fill();
        pg.fillStyle = "black";
        pg.textAlign = "center";
        pg.font = "20px Arial";
        pg.fillText(me.name, 0, 7);

    }

    function drawPlayers() {

        for (var i = 0; i < players.length; i++) {

            var player = players[i];

            if (player.id !== me.id) {

                pg.fillStyle = "#ffcc00";
                pg.beginPath();
                pg.arc(me.x - player.x, me.y - player.y, 30, 0, 2 * Math.PI);
                pg.fill();
                pg.fillStyle = "black";
                pg.textAlign = "center";
                pg.font = "20px Arial";
                pg.fillText(player.name, me.x - player.x, me.y - player.y + 7);

            }
        }
    }

    function drawResources() {

        for (var i = 0; i < resources.length; i++) {

            var resource = resources[i];

            if (resource.type === "Stone") {

                pg.fillStyle = "gray";
                pg.beginPath();
                pg.arc(me.x - resource.x, me.y - resource.y, resource.size, 0, 2 * Math.PI);
                pg.fill();

            } else if (resource.type === "Bush") {

                pg.fillStyle = "yellow";
                pg.beginPath();
                pg.arc(me.x - resource.x, me.y - resource.y, resource.size, 0, 2 * Math.PI);
                pg.fill();

            } else if (resource.type === "Tree") {

                pg.fillStyle = "green";
                pg.beginPath();
                pg.arc(me.x - resource.x, me.y - resource.y, resource.size, 0, 2 * Math.PI);
                pg.fill();

            }

        }
    }

    function drawMiniMap() {

        miniMap = document.getElementById("minimap");

        miniMap.width = miniMap.height * (miniMap.clientWidth / miniMap.clientHeight);

        mm = miniMap.getContext("2d");

        mm.clearRect(0, 0, 150, 150);

        mm.translate(150, 150);

        mm.fillStyle = "white";
        mm.beginPath();
        mm.arc(-me.x / playgroundSize * 150, -me.y / playgroundSize * 150, 3, 0, 2 * Math.PI);
        mm.fill();

    }
};


var MainMenu = function () {

    this.setup = function () {

        $("#shadow").css("visibility", "visible");

        $("#play").click(function () {

            var nickname = $("#nickname").val();

            $("#shadow").css("visibility", "hidden");

            var game = new Game();
            game.setup(nickname);

        });

    };


};

$(function () {

//    var mainMenu = new MainMenu();
//    mainMenu.setup();

    var game = new Game();
    game.setup("Já");

});