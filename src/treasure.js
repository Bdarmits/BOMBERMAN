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