class Board {
    constructor(canvasEl, ctx, width, height) {
        this.ctx = ctx;
        this.x = width;
        this.y = height;
        // this.canvas = canvasEl;
        this.brickColumnCount = 25;
        this.brickRowCount = 12;
        this.brickWidth = defaultSpriteSize;
        this.brickHeight = defaultSpriteSize;
    }

    initializeBricks() {
        this.brickColumnCount = 25;
        this.brickRowCount = 12;
        const brickWidth = defaultSpriteSize;
        const brickHeight = defaultSpriteSize;
        const brickOffsetLeft = defaultSpriteSize;
        const brickOffsetTop = characterPositionLimitY;
        const brickPadding = defaultSpriteSize;

        const bricks = [];
        for (let c = 0; c < this.brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                if (c % 5 === 0) {
                    bricks[c][r] = { x: 0, y: 0, status: 2 };
                    this.ctx.fillStyle = "#501a36";
                } else {
                    let displayBrick = Math.floor(Math.random() * 2);
                    bricks[c][r] = { x: 0, y: 0, status: displayBrick, hasTreasure: Math.random() >= 0.5};
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
        const brickOffsetLeft = defaultSpriteSize;
        const brickOffsetTop = characterPositionLimitY;
        const brickPadding = defaultSpriteSize;

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