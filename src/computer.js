
class Computer {
    constructor(ctx, canvas, img, game) {

        this.ctx = ctx;
        this.canvas = canvas;
        this.img = img;
        this.currentPosition = { x: canvas.width - defaultSpriteSize, y: canvas.height - defaultSpriteSize };
        this.status = 1;
        this.game = game;
        this.moveKeys = ['left', 'up', 'right', 'down'];
    }
    //this.currentPosition.x
    //this.currentPosition.y
    drawPlayer(x,y) {
        this.ctx.drawImage(this.img, x, y, defaultSpriteSize, defaultSpriteSize);
    }

    bricksCollisionDetection(dx, dy, i){
        return (this.currentPosition.x + defaultSpriteSize / 2) + dx >= i.x &&
            (this.currentPosition.x + defaultSpriteSize / 2) + dx <= i.x + defaultSpriteSize &&
            (this.currentPosition.y + defaultSpriteSize / 2) + dy >= i.y &&
            (this.currentPosition.y + defaultSpriteSize / 2) + dy <= i.y + defaultSpriteSize;
    }

    playerCollisionDetection(dx, dy){
        return (this.currentPosition.x + defaultSpriteSize / 2) + dx >= this.game.player.currentPosition.x
        && (this.currentPosition.x + defaultSpriteSize / 2) + dx <= this.game.player.currentPosition.x + defaultSpriteSize / 2
        && (this.currentPosition.y + defaultSpriteSize / 2) + dy >= this.game.player.currentPosition.y
        && (this.currentPosition.y + defaultSpriteSize / 2) + dy <= this.game.player.currentPosition.y + defaultSpriteSize / 2;
    }

    walkingCollisionDetection(dx, dy) {
        const bricks = this.game.board.allVisibleBricks();
        for (let i = 0; i < bricks.length; i++) {
            if (this.bricksCollisionDetection(dx, dy, bricks[i])) {
                return {dx: 0, dy: 0};
            }
        }

        if (this.playerCollisionDetection(dx, dy)) {
            this.game.player.status = 0;
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
            dx = -defaultSpriteSize / 2;
            dy = 0;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (moveKey === 'up') {
            dx = 0;
            dy = -defaultSpriteSize / 2;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (moveKey === 'right') {
            dx = defaultSpriteSize / 2;
            dy = 0;
            newMove = this.walkingCollisionDetection(dx, dy);
        } else if (moveKey === 'down') {
            dx = 0;
            dy = defaultSpriteSize / 2;
            newMove = this.walkingCollisionDetection(dx, dy);
        }
        dx = newMove.dx;
        dy = newMove.dy;
        return this.moveComputer(dx, dy);
    }

    moveComputer(dx, dy) {
        if (this.currentPosition.x + dx < 0 || this.currentPosition.x + defaultSpriteSize / 2 + dx >= this.canvas.width) {
            dx = 0;
        }
        if (this.currentPosition.y + dy < characterPositionLimitY || this.currentPosition.y + defaultSpriteSize / 2 + dy >= this.canvas.height) {
            dy = 0;
        }
        this.currentPosition.x += dx;
        this.currentPosition.y += dy;
        return this.drawPlayer();
    }
}