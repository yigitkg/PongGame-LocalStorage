(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        secondStick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2: {
            left: 885,
            top: 450
        },

        scoreBoard:{
            position: 'absolute',
            textAlign: 'center',
            left: 330,
            height: 64,
            width: 240,
            fontSize: 48,
            fontFamily: 'Cursive',
            color: '#09EB00',
            lineHeight: 3
        },
        gameWon:{
            position: 'absolute',
            textAlign: 'center',
            left: 330,
            top: 280,
            height: 64,
            width: 240,
            fontSize: 48,
            fontFamily: 'Cursive',
            color: '#05F0DA',
        }
    };

    var CONSTS = {
    	gameSpeed: 4,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        numberOfBalls:5,
    };
    var ballIdList = {};
    var myAudio = new Audio('hitSound2.mp3');
    var myAudio2 = new Audio('hitSound2');
    function start() {
        loadStates();
        draw();
        setEvents();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick))
        .appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.secondStick))
        .appendTo('#pong-game');
        $('<div/>', {id: 'score-board'}).css(CSS.scoreBoard).appendTo('#pong-game');
        $('<div/>', {id: 'game-won'}).css(CSS.gameWon).appendTo('#pong-game');
    }
    function saveStates(){
        localStorage.setItem("states", JSON.stringify(CONSTS));
        clearInterval(pongLoop);
    }
    function loadStates(){
        var states= JSON.parse(window.localStorage.getItem('states'));
        if(states!==null){
            CONSTS=states;
        }
    }
    function createBall(){
        var newBallId= "numberOfBalls"+Math.random();
        ballIdList[Object.keys(ballIdList).length +1] = newBallId
        $('<div/>', {id: newBallId}).css(CSS.ball).appendTo('#pong-game');
        console.log("ballIdList",ballIdList);
    }
    function cpuMode(){
        CSS.stick2.top = CSS.ball.top - CSS.secondStick.height/2;
    }

    function setEvents() {
        $(document).on('keydown', function (e) {
            if (e.keyCode == 32) {
                createBall();
            }
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode == 67) {
                cpuMode();
            }
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode == 80) {
                saveStates();
            }
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode == 87 && CSS.stick1.top > 0) {
                CONSTS.stick1Speed = -3;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = 0;
            }
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode == 83 && CSS.stick1.top < CSS.arena.height-CSS.stick.height) {
                CONSTS.stick1Speed = +3;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 83) {
                CONSTS.stick1Speed = 0;
            }
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode == 38 && CSS.stick2.top > 0) {
                CONSTS.stick2Speed = -3;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 38) {
                CONSTS.stick2Speed = 0;
            }
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode == 40 && CSS.stick2.top < CSS.arena.height-CSS.secondStick.height) {
                CONSTS.stick2Speed = +3;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 40) {
                CONSTS.stick2Speed = 0;
            }
        });
        
    }


    function loop() {
        window.pongLoop = setInterval(function () {
            if(CSS.stick1.top<0){
                CSS.stick1.top=0;
                CONSTS.stick1Speed=0;
            }
            if(CSS.stick1.top> CSS.arena.height-CSS.stick.height){
                CSS.stick1.top=CSS.arena.height-CSS.stick.height;
                CONSTS.stick1Speed=0;
            }
            if(CSS.stick2.top<0){
                CSS.stick2.top=0;
                CONSTS.stick2Speed=0;
            }
            if(CSS.stick2.top>CSS.arena.height-CSS.secondStick.height){
                CSS.stick2.top=CSS.arena.height-CSS.secondStick.height;
                CONSTS.stick2Speed=0;
            }

            CSS.stick1.top += CONSTS.stick1Speed;
            $('#stick-1').css('top', CSS.stick1.top);

            CSS.stick2.top += CONSTS.stick2Speed;
            $('#stick-2').css('top', CSS.stick2.top);

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
                // myAudio.play();
                
            }

            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            
            if (CSS.ball.left <= CSS.stick.width) {
            	CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll(1); 
                // myAudio.play();
                // myAudio2.play();
            }
            
            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.secondStick.width) {
                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.secondStick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll(2);
                // myAudio.play();
            }
        }, CONSTS.gameSpeed);
    }

    function roll(player) {
        console.log("score",CONSTS.score1+CONSTS.score2)
        if((CONSTS.score1+CONSTS.score2)!==CONSTS.numberOfBalls){
            if(player === 2){
                CONSTS.score1++;
            }else if(player === 1){
                CONSTS.score2++;
            }
            console.log(CONSTS.score1 ," , ", CONSTS.score2)
            $('#score-board').html(CONSTS.score1 + " - " + CONSTS.score2)
            if((CONSTS.score1+CONSTS.score2) === CONSTS.numberOfBalls || Math.abs(CONSTS.score1-CONSTS.score2) > CONSTS.numberOfBalls-(CONSTS.score1+CONSTS.score2)){
                if(CONSTS.score1>CONSTS.score2){
                    $('#game-won').html("PLAYER 1 WON!")
                }else{
                    $('#game-won').html("PLAYER 1 WON!")
                }
                CONSTS.ballTopSpeed = 0;
                CONSTS.ballLeftSpeed = 0;
                // $('#score-board').css('visibility', 'hidden')
                $('#game-won').css('visibility', 'visible')
                $('#pong-line').css('visibility', 'hidden')
                clearInterval(pongLoop);
            }else if((CONSTS.score1+CONSTS.score2) !== CONSTS.numberOfBalls){
                CSS.ball.top = 300;
                CSS.ball.left = 450;

                var side = -1;

                if (Math.random() < 0.5) {
                    side = 1;
                }

                CONSTS.ballTopSpeed = side *  (Math.random() * -2 + 3)/2;
                CONSTS.ballLeftSpeed = side * (Math.random() * -2 + 3)/2;
            }
        }
        
    }

    start();
})();