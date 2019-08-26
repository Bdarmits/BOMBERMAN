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
// module.exports = Items;