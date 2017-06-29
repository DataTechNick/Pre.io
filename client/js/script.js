var Game = function () {

    var socket;
    var me;

    var players = [];
    var resources = [];
    var animals = [];
    var buildings = [];

    var meResources = {wood: 0, stone: 0, weed: 0, leather: 0, food: 0};

    var playgroundSize = 10000;
    var speed = 10;

    var hud;
    var playground;

    this.Setup = function (name) {

        playground = new Playground();
        playground.Init(playgroundSize);

        hud = new Hud();
        hud.Init(playgroundSize);

        var name = name;

        socket = io.connect('192.168.1.125:80'); // change IP



        socket.on('newPlayer', function (data) {

            me = new Player(data, name, Math.floor(Math.random() * playgroundSize), Math.floor(Math.random() * playgroundSize), "type", 100, 0);

            var collision;

            do {

                collision = false;

                for (i = 0; i < resources.length; i++) {

                    if (detectColision(me.x, me.y, 30, resources[i].x, resources[i].y, resources[i].size)) {

                        collision = true;

                        me.x = Math.floor(Math.random() * playgroundSize);
                        me.y = Math.floor(Math.random() * playgroundSize);

                        break;

                    }
                }



            } while (collision);

            socket.emit('newPlayer', me);

            startTick();

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

        socket.on('rotate', function (data) {

            var i = players.findIndex(x => x.id === data.id);

            if (i !== -1) {
                players[i].rot = data.rot;
            }

        });

    };

    var startTick = function () {

        setInterval(tick, 20); //fps
        function tick() {

            updateMe();
            playground.Draw(me, players, resources, animals, buildings);
            hud.DrawMiniMap(me);

        }

    };



    window.onresize = function () {

        playground.Init();

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

        if (event.keyCode === 65) {
            right = speed;
        }
        if (event.keyCode === 87) {
            down = speed;
        }
        if (event.keyCode === 68) {
            left = speed;
        }
        if (event.keyCode === 83) {
            up = speed;
        }

    });

    document.addEventListener("keyup", function (event) {
        event.preventDefault();

        if (event.keyCode === 65) {
            right = 0;
        }
        if (event.keyCode === 87) {
            down = 0;
        }
        if (event.keyCode === 68) {
            left = 0;
        }
        if (event.keyCode === 83) {
            up = 0;
        }

    });

    $("canvas").mousedown(function (event) {
        event.preventDefault();

//        console.log(event.clientX);
//        console.log(event.clientY);
//        console.log(window.innerHeight);
//        console.log(window.innerWidth);

        console.log("ahoj");

        console.log(resources.indexOf(res => Math.sqrt(Math.pow(res.x - me.x, 2) + Math.pow(res.y - me.y, 2)) <= res.size + 30 + 30));

        getWood = 1;
        getStone = 1;
        getWeed = 1;
        getLeather = 1;
        getFood = 1;

    });

    $("canvas").mouseup(function (event) {
        event.preventDefault();

        console.log("ahoj2");

        getWood = 0;
        getStone = 0;
        getWeed = 0;
        getLeather = 0;
        getFood = 0;

    });

    document.onmousemove = function (e) {

        var dx = e.pageX - $(window).innerWidth() / 2;
        var dy = e.pageY - $(window).innerHeight() / 2;

        var rot = Math.atan2(dy, dx);

        socket.emit("rotate", {rot: rot, id: me.id});

        me.rot = rot + Math.PI / 2;

    };





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

        for (i = 0; i < resources.length; i++) {

            if (detectColision(me.x, me.y, 30, resources[i].x, resources[i].y, resources[i].size)) {

                //console.log(countCorrectPosition(me, resources[i], oldX, oldY));

                me.x = oldX;
                me.y = oldY;

            }
        }

    }

    function detectColision(x1, y1, r1, x2, y2, r2) {

        return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) <= r1 + r2);

    }

    function countCorrectPosition(me, res, oldX, oldY) {

        var sX = me.x - oldX;
        var sY = me.y - oldY;



    }

    function addResources(wood, stone, weed, leather, food) {

        meResources.wood += wood;
        meResources.stone += stone;
        meResources.weed += weed;
        meResources.leather += leather;
        meResources.food += food;

    }

};



var Playground = function () {

    var playground;
    var pg;

    var playgroundSize;

    this.Init = function (pgSize) {

        playgroundSize = pgSize;

        playground = document.getElementById("playground");

        playground.height = window.innerHeight;
        playground.width = window.innerWidth;

        pg = playground.getContext("2d");
        pg.translate(window.innerWidth / 2, window.innerHeight / 2);

    };

    this.Draw = function (me, players, resources, animals, buildings) {

        pg.clearRect(-(window.innerWidth / 2), -(window.innerHeight / 2), window.innerWidth, window.innerHeight);

        drawPlayers(me, players);
        drawMe(me);
        drawResources(me, resources);

    };

    function drawMe(me) {

        pg.rotate(me.rot);

        pg.fillStyle = "#ffcc00";
        pg.beginPath();
        pg.arc(0, 0, 30, 0, 2 * Math.PI);
        pg.fill();
        pg.fillStyle = "black";
        pg.textAlign = "center";
        pg.font = "20px Arial";
        pg.fillText(me.name, 0, 7);

        pg.rotate(-me.rot);

    }

    function drawPlayers(me, players) {

        for (var i = 0; i < players.length; i++) {

            var player = players[i];

            if (player.id !== me.id) {

                pg.translate(window.innerWidth / 2 - player.x, window.innerHeight / 2 - player.y);
                pg.rotate(player.rot);

                pg.fillStyle = "#ffcc00";
                pg.beginPath();
                pg.arc(me.x - player.x, me.y - player.y, 30, 0, 2 * Math.PI);
                pg.fill();
                pg.fillStyle = "black";
                pg.textAlign = "center";
                pg.font = "20px Arial";
                pg.fillText(player.name, me.x - player.x, me.y - player.y + 7);

                pg.rotate(-player.rot);

            }
        }
    }

    function drawResources(me, resources) {

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

};

var Hud = function () {

    var playgroundSize;

    this.Init = function (pgSize) {

        playgroundSize = pgSize;

    };

    this.DrawMiniMap = function (me) {

        miniMap = document.getElementById("minimap");

        miniMap.width = miniMap.height * (miniMap.clientWidth / miniMap.clientHeight);

        mm = miniMap.getContext("2d");

        mm.clearRect(0, 0, 150, 150);

        mm.translate(150, 150);

        mm.fillStyle = "white";
        mm.beginPath();
        mm.arc(-me.x / playgroundSize * 150, -me.y / playgroundSize * 150, 3, 0, 2 * Math.PI);
        mm.fill();

    };

    this.UpdateResources = function (wood, stone, weed, leather, food) {

        $("#wood").text(wood);
        $("#stone").text(stone);
        $("#weed").text(weed);
        $("#leather").text(leather);
        $("#food").text(food);

    };

    this.UpdateHealth = function (health) {

    };

    this.UpdateStamina = function (stamina) {

    };

    this.UpdateXp = function (xp) {

    };

};

var MainMenu = function () {

    this.Setup = function () {

        $("#shadow").css("visibility", "visible");

        $("#play").click(function () {

            var nickname = $("#nickname").val();

            $("#shadow").css("visibility", "hidden");

            var game = new Game();
            game.Setup(nickname);

        });

    };


};

$(function () {

//    var mainMenu = new MainMenu();
//    mainMenu.Setup();

    var game = new Game();
    game.Setup("Já");

});