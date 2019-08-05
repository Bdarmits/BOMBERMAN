//TODO: рознести по файлах
//TODO: game.js starts a game
//TODO: впевнитися що в класах функції мають їм належити  "keydownhandler"
//TODO: move magic numbers into cinstants

class Player {
    constructor(ctx, canvas, img, game) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.img = img;
        this.currentPosition = {x: 0, y: 65 };
        this.status = 1;
        this.numBombs = 1;
        this.game = game;
        this.width = 44;
        this.height = 44;
        this.bombs = [];
    }

    drawPlayer() {
        this.ctx.drawImage(this.img, this.currentPosition.x, this.currentPosition.y,
            44, 44);
    }

    keyDownHandler(e) {
        if (!this.game.started) {
            return;
        }
        let dx = 0;
        let dy = 0;
        let newMove = {dx: 0, dy: 0};

        if (e.key === "ArrowLeft") {
            dx = -22;
            dy = 0;
            newMove = this.walkingCollisionDetection(dx, dy);

        } else if (e.key === "ArrowDown") {
            dx = 0;
            dy = 22;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (e.key === "ArrowUp") {
            dx = 0;
            dy = -22;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (e.key === "ArrowRight") {
            dx = 22;
            dy = 0;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (e.key === "b") {
            dx = 0;
            dy = 0;
            // if (this.numBombs > 0) {
            this.setBomb = true;
            this.placeBomb();
            // }
        } else {
            dx = 0;
            dy = 0;
        }
        dx = newMove.dx;
        dy = newMove.dy;
        return this.movePlayer(dx, dy);
    }

    movePlayer(dx, dy) {

        if (this.currentPosition.x + dx < 0 || this.currentPosition.x + dx + 22 >= this.canvas.width) {
            dx = 0;
        }
        else if (this.currentPosition.y + dy < 65 || this.currentPosition.y + dy + 22 >= this.canvas.height) {
            dy = 0;
        }

        this.currentPosition.x += dx;
        this.currentPosition.y += dy;
        return this.drawPlayer();
    }

    placeBomb() {
        this.numBombs -= 1;
        const bomb = new Items(this.ctx, this, 'bomb', "#233D4D", {x: this.currentPosition.x + 15, y: this.currentPosition.y}, this.game);
        this.bombs.push(bomb);
        bomb.drawItem();
        window.setTimeout(bomb.detonate.bind(bomb), 4000);
    }

    bombAvatarCollisionDetection(bombPosition) {  //винести
        let playerPosition = this.currentPosition;
        let computerPosition = this.game.computer.currentPosition;
        let leftBlastRadius = bombPosition.x - 50;
        let rightBlastRadius = bombPosition.x + 50;
        let topBlastRadius = bombPosition.y - 50;
        let bottomBlastRadius = bombPosition.y + 50;

        //TODO: move conditional into method

        if (playerPosition.x > leftBlastRadius && playerPosition.x < rightBlastRadius
            && playerPosition.y > topBlastRadius && playerPosition.y < bottomBlastRadius) {
            this.status = 0;
        }
        if (computerPosition.x > leftBlastRadius && computerPosition.x < rightBlastRadius
            && computerPosition.y > topBlastRadius && computerPosition.y < bottomBlastRadius) {
            this.game.computer.status = 0;
        }
    }


    bombBrickCollisionDetection(bombPosition) {
        let leftBlastRadius = bombPosition.x - 50;
        let rightBlastRadius = bombPosition.x +50;
        let bottomBlastRadius = bombPosition.y + 50;
        let topBlastRadius = bombPosition.y - 50;

        const collidedBricks = this.game.board.bricksStillStanding().filter(
            brick => brick.x > leftBlastRadius && brick.x < rightBlastRadius
                && brick.y > topBlastRadius && brick.y < bottomBlastRadius);

        collidedBricks.forEach( brick => {
            brick.status = 0;

        });
        return collidedBricks;

    }

    walkingCollisionDetection(dx, dy) {
        const bricks = this.game.board.allVisibleBricks();
        for (let i = 0; i < bricks.length; i++) {
            if ((this.currentPosition.x + 22) + dx >= bricks[i].x &&
                (this.currentPosition.x + 22) + dx <= bricks[i].x + 44 &&
                (this.currentPosition.y + 22) + dy >= bricks[i].y &&
                (this.currentPosition.y + 22) + dy <= bricks[i].y + 44) {
                return {dx: 0, dy: 0};
            }
        }
        if ((this.currentPosition.x + 22) + dx >= this.game.computer.currentPosition.x
            && (this.currentPosition.x + 22) + dx <= this.game.computer.currentPosition.x + 22
            && (this.currentPosition.y + 22) + dy >= this.game.computer.currentPosition.y
            && (this.currentPosition.y + 22) + dy <= this.game.computer.currentPosition.y + 22) {
            return { dx: 0, dy: 0};
        }

        return { dx, dy };
    }
}

class Board {
    constructor(canvasEl, ctx, width, height) {
        this.ctx = ctx;
        this.x = width;
        this.y = height;
        // this.canvas = canvasEl;
        this.brickColumnCount = 25;
        this.brickRowCount = 12;
        this.brickWidth = 44;
        this.brickHeight = 44;
    }
//TODO: define enums for status

    initializeBricks() {
        this.brickColumnCount = 25;
        this.brickRowCount = 12;
        const brickWidth = 44;
        const brickHeight = 44;
        const brickOffsetLeft = 44;
        const brickOffsetTop = 65;
        const brickPadding = 44;

        const bricks = [];
        for (let c = 0; c < this.brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                if (c % 5 === 0) {
                    bricks[c][r] = { x: 0, y: 0, status: 2 };
                    this.ctx.fillStyle = "#501a36";
                } else {
                    let displayBrick = Math.floor(Math.random() * 2);
                    bricks[c][r] = { x: 0, y: 0, status: displayBrick};
                    this.ctx.fillStyle = "#A4243B";
                }
                if (bricks[c][r].status === 2 || bricks[c][r].status === 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;

                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
        this.bricks = bricks;
    }

    drawBricks() {
        const brickOffsetLeft = 44;
        const brickOffsetTop = 65;
        const brickPadding = 44;

        const bricks = [];
        for (let c = 0; c < this.brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                if (c % 5 === 0) {
                    bricks[c][r] = { x: 0, y: 0, status: 2 };
                    this.ctx.fillStyle = "#501a36";
                } else {
                    let displayBrick = this.bricks[c][r].status;
                    bricks[c][r] = { x: 0, y: 0, status: displayBrick};
                    this.ctx.fillStyle = "#A4243B";
                }
                if (bricks[c][r].status === 2 || bricks[c][r].status === 1) {
                    let brickX = (c * (this.brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (this.brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;

                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }

    // getBrickColumnCount(){
    //     return this.brickColumnCount;
    // }
    //
    // getBrickRowCount() {
    //     return this.brickRowCount;
    // }
    //
    // getBrickWidth() {
    //     return this.brickWidth;
    // }
    //
    // getBrickHeight() {
    //     return this.brickHeight;
    // }

    draw() {
        this.drawBricks();
    }

    bricksStillStanding() {
        const bricksStillStanding = [];
        this.bricks.forEach( column => column.forEach( brick => {
            if (brick.status === 1) {
                bricksStillStanding.push(brick);
            }
        }));
        return bricksStillStanding;
    }

    allVisibleBricks() {
        const allVisibleBricks = [];
        this.bricks.forEach( column => column.forEach( brick => {
            if (brick.status === 1 || brick.status === 2) {
                allVisibleBricks.push(brick);
            }
        }));
        return allVisibleBricks;
    }
}

class Computer {
    constructor(ctx, canvas, img, game) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.img = img;
        this.currentPosition = { x: canvas.width - 44, y: canvas.height - 44 };
        this.status = 1;
        this.game = game;
        this.moveKeys = ['left', 'up', 'right', 'down'];
    }
    drawPlayer() {
        this.ctx.drawImage(this.img, this.currentPosition.x,
            this.currentPosition.y, 44, 44);
    }

    walkingCollisionDetection(dx, dy) {
        const bricks = this.game.board.allVisibleBricks();
        for (let i = 0; i < bricks.length; i++) {
            if ((this.currentPosition.x + 22) + dx >= bricks[i].x &&
                (this.currentPosition.x + 22) + dx <= bricks[i].x + 44 &&
                (this.currentPosition.y + 22) + dy >= bricks[i].y &&
                (this.currentPosition.y + 22) + dy <= bricks[i].y + 44) {
                return {dx: 0, dy: 0};
            }
        }
        if ((this.currentPosition.x + 22) + dx >= this.game.player.currentPosition.x
            && (this.currentPosition.x + 22) + dx <= this.game.player.currentPosition.x + 22
            && (this.currentPosition.y + 22) + dy >= this.game.player.currentPosition.y
            && (this.currentPosition.y + 22) + dy <= this.game.player.currentPosition.y + 22) {
            return { dx: 0, dy: 0};
        }

        return { dx, dy };
    }

    handleAction() {
        if (!this.game.started) {
            return;
        }
        let dx = 0;
        let dy = 0;
        let newMove = { dx: 0, dy: 0 };
        let moveIndex = Math.floor(Math.random() * 4); // moves.length
        let moveKey = this.moveKeys[moveIndex];

        if (moveKey === 'left') {
            dx = -22;
            dy = 0;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (moveKey === 'up') {
            dx = 0;
            dy = -22;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (moveKey === 'right') {
            dx = 22;
            dy = 0;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (moveKey === 'down') {
            dx = 0;
            dy = 22;
            newMove = this.walkingCollisionDetection(dx, dy);
        }
        dx = newMove.dx;
        dy = newMove.dy;
        return this.moveComputer(dx, dy);
    }

    moveComputer(dx, dy) {
        if (this.currentPosition.x + dx < 0 || this.currentPosition.x + 22 + dx >= this.canvas.width) {
            dx = 0;
        }
        if (this.currentPosition.y + dy < 65 || this.currentPosition.y + 22 + dy >= this.canvas.height) {
            dy = 0;
        }
        this.currentPosition.x += dx;
        this.currentPosition.y += dy;
        return this.drawPlayer();
    }
}

class Treasure{
    constructor(ctx, bomb) {
        this.ctx = ctx;
        const flowerSprite = new Image();
        flowerSprite.src = "src/images/rose.png";
        this.img = flowerSprite;
        this.bomb = bomb;
        // this.types = ["flower"];
        // this.status = 1;
        // this.position = {x: position.x, y: position.y};
        // this.radius = 50;
    }

    //  randomTreasure(){
    //     let moveIndex = Math.floor(Math.random()); // moves.length
    //      return this.types[moveIndex];
    // }
    drawTreasure(){
        // let treasure = this.randomTreasure();
        this.ctx.drawImage(this.img, this.bomb.x, this.bomb.y);
    }
}
class Items {
    constructor(ctx, player, type, color, position) {
        this.ctx = ctx;
        this.player = player;
        this.type = type;
        this.status = 1;
        this.color = color;
        this.position = {x: position.x, y: position.y};
        // this.radius = 50;

    }

    drawItem() {
        if (this.type === 'bomb') {
            this.ctx.beginPath();
            this.ctx.arc(this.position.x, this.position.y, 15, 0, Math.PI*2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    detonate() {
        this.status = 3;
    }


    drawExplosion() {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, 50, 0, Math.PI*2);
        this.ctx.fillStyle = "#233D4D";
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, 45, 0, Math.PI*2);
        this.ctx.fillStyle = "#64a7d1";
        this.ctx.fill();
        this.ctx.closePath();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const canvasEl = document.getElementById('my-canvas');
    const ctx = canvasEl.getContext('2d');


    const howToButton = document.getElementById('how-to');
    howToButton.addEventListener("click", toggleModal, false);
    const closeButton = document.getElementById('close');
    closeButton.addEventListener("click", toggleModal, false);

    const board = new Board(canvasEl, ctx, canvasEl.width/2, canvasEl.height-65);
    board.initializeBricks();

    const computerSprite = new Image();
    const computer = new Computer(ctx, canvasEl, computerSprite);
    computerSprite.addEventListener("load", function() {
        computer.drawPlayer();
    }, false);
    computerSprite.src = 'src/images/zombie.png';

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

//TODO: remove event listener

    const game = new Game(board, computer, player, canvasEl, ctx);
    const startButton = document.getElementById('start');
    startButton.addEventListener("click", function () {
        game.start.bind(this);
        game.start();
    }, true);

    player.game = game;
    computer.game = game;

    const play = document.getElementsByClassName('play-again')[0]; // lost
    play.addEventListener("click", function () {
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


class Game {
    constructor(board, computer, player, canvas, ctx) {
        this.board = board;
        this.computer = computer;
        this.player = player;
        this.canvas = canvas;
        this.ctx = ctx;
        // this.items = this.player.bombs;
        // this.destroyables = this.allDestroyableObjects();
        this.draw = this.draw.bind(this);
    }

    // allDestroyableObjects() {
    //     return this.board.bricksStillStanding().concat(this.computer, this.player,
    //         this.player.bombs, this.computer.bombs);
    // }

    draw() {
        // let progress = timesta/mp - timestamp;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.board.draw();
        this.computer.drawPlayer();
        this.player.drawPlayer();
        // this.ctx.drawImage(new Image().src = "src/images/rose.png", 100, 100);
        let collidedBricks = [];
        if (this.player.setBomb) { // TODO: remove bool flag
            // this.destroyables = this.allDestroyableObjects();
            this.player.bombs.forEach( bomb => {
                if (bomb.status === 1) {
                    bomb.drawItem();
                    window.setTimeout(bomb.detonate.bind(bomb), 3000);
                    bomb.status = 2;
                } else if (bomb.status === 2) {
                    bomb.drawItem();
                } else if (bomb.status === 3) {
                    bomb.drawExplosion();
                    collidedBricks = this.collisionDetection();
                    this.player.bombs.pop();
                    this.player.setBomb = false;
                    this.player.numBombs += 1;
                }
            });
        }
        if (collidedBricks.length) {
            collidedBricks.forEach(brick => {
               this.ctx.drawImage(new Image().src = "src/images/rose.png", brick.x, brick.y)
            });
            // collidedBricks = [];
        }


        if (!this.gameOver()) {
            window.requestAnimationFrame(this.draw);
        } else {
            this.displayEndMessage();
        }
    }

    start(){
        this.started = true;
        const gameCover = document.getElementById('game-start-cover');
        if (gameCover.style.visibility === 'hidden') {
            gameCover.style.visibility = 'visible';
        } else {
            gameCover.style.visibility = 'hidden';
        }
        window.setInterval(this.computer.handleAction.bind(this.computer), 500);
        window.requestAnimationFrame(this.draw);
    }

    gameOver() {
        return this.player.status === 0 || this.computer.status === 0;
    }


    collisionDetection() {
        // let bombPosition;
        let playerBombPosition;
        // let computerBombPosition;
        let colidedBricks = [];
        if (this.player.bombs) {
            playerBombPosition = this.player.bombs[0].position;
            this.player.bombAvatarCollisionDetection(playerBombPosition);
            colidedBricks = this.player.bombBrickCollisionDetection(playerBombPosition);
        }
        return colidedBricks;
    }

    displayEndMessage() {
        this.started = false;
        if (this.player.status === 0) {
            const modal = document.getElementById('lost');
            modal.classList.add("show");
        } else {
            const modal = document.getElementById('won');
            modal.classList.add('show');
        }
    }
}
