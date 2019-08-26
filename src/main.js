document.addEventListener("DOMContentLoaded", () => {
    const canvasEl = document.getElementById('my-canvas');
    const ctx = canvasEl.getContext('2d');


    const howToButton = document.getElementById('how-to');
    howToButton.addEventListener("click", toggleModal, false);
    const howToButton2 = document.getElementById('how-to2');
    howToButton2.addEventListener("click", toggleModal2, false);
    const howToButton3 = document.getElementById('how-to3');
    howToButton3.addEventListener("click", toggleModal3, false);

    const closeButton = document.getElementById('close');
    closeButton.addEventListener("click", toggleModal, false);
    const closeButton2 = document.getElementById('closed');
    closeButton2.addEventListener("click", toggleModal2, false);
    const closeButton3 = document.getElementById('closed2');
    closeButton3.addEventListener("click", toggleModal3, false);

    document.getElementById("bricks").innerHTML = 0;
    document.getElementById("bombs").innerHTML = 0;
    document.getElementById("moves").innerHTML = 0;
    document.getElementById("deaths").innerHTML = localStorage.getItem("totalDeathsCounter");



    const board = new Board(canvasEl, ctx, canvasEl.width/2, canvasEl.height-65);
    board.initializeBricks();

    var computerArr = [];



    for (i = 0; i < zombiesSpawnNumber; i++) {
        const computerSprite = new Image();
        const computer = new Computer(ctx, canvasEl, computerSprite);
        computerSprite.addEventListener("load", function () {
            computer.drawPlayer();
            }, false);
        computerSprite.src = 'src/images/zombie.png';
        computer.drawPlayer(canvasEl.width - 44 * i + 1, canvasEl.height - 44);
        computerArr.push(computer);
    }
    
    const playerSprite = new Image();
    const player = new Player(ctx, canvasEl, playerSprite);
    playerSprite.addEventListener("load", function () {
        player.movePlayer.bind(player);
        player.drawPlayer();
    }, false);
    playerSprite.src = 'src/images/man.png';

    document.addEventListener("keydown", function (e) {
        player.keyDownHandler(e);
    }, true);

//TODO: remove event listener після хзакінчення відписати


    const game = new Game(board, computerArr, player, canvasEl, ctx);
    const startButton = document.getElementById('start');
    startButton.addEventListener("click", function () {
        game.start.bind(this);
        game.start();
    }, true);

    const deathsStatDropButton = document.getElementById('globalStatsButton');
    startButton.addEventListener("click", function () {
        localStorage.setItem("totalDeathsCounter", "0");

    }, true);

    player.game = game;
    computerArr.forEach( computer => {
        computer.game = game;

    });

    const play = document.getElementsByClassName('play-again')[0]; // lost
    play.addEventListener("click", function () {
        let totalDeathCounter = Number(localStorage.getItem("totalDeathsCounter"));
        totalDeathCounter++;
        localStorage.setItem("totalDeathsCounter", totalDeathCounter.toString());
        document.getElementById("deaths").innerHTML = localStorage.getItem("totalDeathsCounter");
        const lost = document.getElementById('lost');
        lost.classList.remove('show');
        document.location.reload();
        game.start.bind(this);
        game.start();
    }, false);

    const play2 = document.getElementsByClassName('play-again')[1]; // won
    play2.addEventListener("click", function () {
        const won = document.getElementById('won');
        won.classList.remove('show');
        document.location.reload();
        game.start.bind(this);
        game.start();
    }, false);

});

function toggleModal() {
    const modal = document.getElementsByClassName('modal')[0];
    if (modal.style.visibility === 'visible') {
        modal.style.visibility = 'hidden';
    } else {
        modal.style.visibility = 'visible';
    }
}

function toggleModal2() {
    const modal = document.getElementsByClassName('modal')[1];
    if (modal.style.visibility === 'visible') {
        modal.style.visibility = 'hidden';
    } else {
        modal.style.visibility = 'visible';
    }
}
function toggleModal3() {
    const modal = document.getElementsByClassName('modal')[2];
    if (modal.style.visibility === 'visible') {
        modal.style.visibility = 'hidden';
    } else {
        modal.style.visibility = 'visible';
    }
}