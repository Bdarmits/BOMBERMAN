//TODO: define enums for status

const defaultSpriteSize = 44;
const bombTimer = 3000;
const computerMoveTimer = 500;
const characterPositionLimitY = 65;
const bombBlastRadius = 50;
const zombiesSpawnNumber = 1;

class Game {
    constructor(board, computerArr, player, canvas, ctx) {
        this.board = board;
        this.computerArr = computerArr;
        this.player = player;
        this.canvas = canvas;
        this.collidedBricksCounter = 0;
        this.bombsUsedCounter = 0;
        this.zombiesKilledCounter = 0;
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
        this.computerArr.forEach(computer =>{
            if (computer.status === 0){
                this.computerArr.pop(computer);
            }else{
                computer.drawPlayer(computer.currentPosition.x, computer.currentPosition.y);
            }
        });

        this.player.drawPlayer();
        document.getElementById("deaths").innerHTML = localStorage.getItem("totalDeathsCounter");

        // this.ctx.drawImage(new Image().src = "src/images/rose.png", 100, 100);
        let collidedBricks = [];
        if (this.player.setBomb) { // TODO: remove bool flag
            // this.destroyables = this.allDestroyableObjects();
            this.player.bombs.forEach( bomb => {
                if (bomb.status === 1) {
                    this.bombsUsedCounter++;
                    document.getElementById("bombs").innerHTML = this.bombsUsedCounter;
                    bomb.drawItem();
                    window.setTimeout(bomb.detonate.bind(bomb), bombTimer);
                    bomb.status = 2;
                } else if (bomb.status === 2) {
                    bomb.drawItem();
                } else if (bomb.status === 3) {
                    bomb.drawExplosion();
                    collidedBricks = this.collisionDetection();
                    this.player.bombs.pop();
                    this.player.setBomb = false;
                    this.player.numBombs += 1;
                    document.getElementById("bricks").innerHTML = this.collidedBricksCounter;

                }
            });

        }
        const treasureSprite = new Image();
        let self = this;
        treasureSprite.onload = function () {
            if (collidedBricks.length) {
                collidedBricks.forEach(brick => {
                    self.ctx.drawImage(treasureSprite, brick.x, brick.y, defaultSpriteSize, defaultSpriteSize)
                });
                collidedBricks = [];
            }
        };
        treasureSprite.src = 'src/images/rose.png';


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
        this.computerArr.forEach(computer => {
            window.setInterval(computer.handleAction.bind(computer), computerMoveTimer);

        });
        window.requestAnimationFrame(this.draw);
    }

    gameOver() {
        return this.player.status === 0 ;
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
        this.collidedBricksCounter += colidedBricks.length;
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

