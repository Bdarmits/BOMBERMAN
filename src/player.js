// const Items = require("items");

class Player {
    constructor(ctx, canvas, img, game) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.img = img;
        this.currentPosition = {x: 0, y: characterPositionLimitY };
        this.status = 1;
        this.numBombs = 1;
        this.game = game;
        this.width = defaultSpriteSize;
        this.height = defaultSpriteSize;
        this.bombs = [];
        this.movesMadeCounter = 0;
    }

    drawPlayer() {
        this.ctx.drawImage(this.img, this.currentPosition.x, this.currentPosition.y,
            defaultSpriteSize, defaultSpriteSize);
    }

    keyDownHandler(e) {
        if (!this.game.started) {
            return;
        }
        let dx = 0;
        let dy = 0;
        let newMove = {dx: 0, dy: 0};

        if (e.key === "ArrowLeft") {
            dx = 0 - (defaultSpriteSize / 2);
            dy = 0;
            newMove = this.walkingCollisionDetection(dx, dy);

        } else if (e.key === "ArrowDown") {
            dx = 0;
            dy = defaultSpriteSize / 2;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (e.key === "ArrowUp") {
            dx = 0;
            dy = 0 - (defaultSpriteSize / 2);
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (e.key === "ArrowRight") {
            dx = defaultSpriteSize / 2;
            dy = 0;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (e.key === "b") {
            dx = 0;
            dy = 0;
            if (this.numBombs > 0) {
                this.setBomb = true;
                this.placeBomb();
            }
        } else {
            dx = 0;
            dy = 0;
        }
        dx = newMove.dx;
        dy = newMove.dy;
        return this.movePlayer(dx, dy);
    }

    playerMoveAbilityCheckerX(dx){
        return this.currentPosition.x + dx < 0 || this.currentPosition.x + dx + defaultSpriteSize / 2 >= this.canvas.width;
    }

    playerMoveAbilityCheckerY(dy){
        return this.currentPosition.y + dy < characterPositionLimitY || this.currentPosition.y + dy + defaultSpriteSize / 2 >= this.canvas.height;
    }

    movePlayer(dx, dy) {

        if (this.playerMoveAbilityCheckerX(dx)) {
            dx = 0;
        }
        else if (this.playerMoveAbilityCheckerY(dy)) {
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
        window.setTimeout(bomb.detonate.bind(bomb), bombTimer);
    }

    static avatarInBombBlastRadiusChecker(avatar, leftBlastRadius, rightBlastRadius, topBlastRadius, bottomBlastRadius){
        return avatar.x > leftBlastRadius && avatar.x < rightBlastRadius
            && avatar.y > topBlastRadius && avatar.y < bottomBlastRadius;
    }
    bombAvatarCollisionDetection(bombPosition) {  //винести
        let playerPosition = this.currentPosition;

        // this.game.computerArr.forEach( computer =>{
        //
        // });
        let computerArr = this.game.computerArr;

        let leftBlastRadius = bombPosition.x - bombBlastRadius;
        let rightBlastRadius = bombPosition.x + bombBlastRadius;
        let topBlastRadius = bombPosition.y - bombBlastRadius;
        let bottomBlastRadius = bombPosition.y + bombBlastRadius;

        if (Player.avatarInBombBlastRadiusChecker(playerPosition, leftBlastRadius, rightBlastRadius, topBlastRadius, bottomBlastRadius)) {
            this.status = 0;
        }
        computerArr.forEach( computer => {
            if (Player.avatarInBombBlastRadiusChecker(computer.currentPosition, leftBlastRadius, rightBlastRadius, topBlastRadius, bottomBlastRadius)) {
                computer.status = 0;
            }
        });

    }


    bombBrickCollisionDetection(bombPosition) {
        let leftBlastRadius = bombPosition.x - bombBlastRadius;
        let rightBlastRadius = bombPosition.x +bombBlastRadius;
        let bottomBlastRadius = bombPosition.y + bombBlastRadius;
        let topBlastRadius = bombPosition.y - bombBlastRadius;

        const collidedBricks = this.game.board.bricksStillStanding().filter(
            brick => brick.x > leftBlastRadius && brick.x < rightBlastRadius
                && brick.y > topBlastRadius && brick.y < bottomBlastRadius);

        collidedBricks.forEach( brick => {
            brick.status = 0;

        });
        return collidedBricks;

    }

    movesMadeCounterFunc(){
        this.movesMadeCounter++;
        document.getElementById("moves").innerHTML = this.movesMadeCounter;
    }

    bricksCollisionDetection(dx, dy, i){
        return (this.currentPosition.x + defaultSpriteSize / 2) + dx >= i.x &&
            (this.currentPosition.x + defaultSpriteSize / 2) + dx <= i.x + defaultSpriteSize &&
            (this.currentPosition.y + defaultSpriteSize / 2) + dy >= i.y &&
            (this.currentPosition.y + defaultSpriteSize / 2) + dy <= i.y + defaultSpriteSize;
    }

    playerCollisionDetection(dx, dy, computer){
            return (this.currentPosition.x + defaultSpriteSize / 2) + dx >= computer.x
            && (this.currentPosition.x + defaultSpriteSize / 2) + dx <= computer.x + defaultSpriteSize / 2
            && (this.currentPosition.y + defaultSpriteSize / 2) + dy >= computer.y
            && (this.currentPosition.y + defaultSpriteSize / 2) + dy <= computer.y + defaultSpriteSize / 2;
    }

    walkingCollisionDetection(dx, dy) {
        const bricks = this.game.board.allVisibleBricks();
        for (let i = 0; i < bricks.length; i++) {
            if (this.bricksCollisionDetection(dx, dy, bricks[i])) {
                return {dx: 0, dy: 0};
            }
        }
        this.game.computerArr.forEach(computer => {
            if (this.playerCollisionDetection(dx, dy, computer)) {
                this.game.player.status = 0;
                return { dx: 0, dy: 0};
            }
        }) ;

        this.movesMadeCounterFunc();
        return { dx, dy };
    }
}

