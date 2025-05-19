import BasicFigure from './basic-figure.js';

export default class Hexagon extends BasicFigure {
    constructor(x, y, vx, vy, size, color) {
        super(x, y, vx, vy, color);
        this.size = size;
    }
    get left()   { return this.x - this.size; }
    get right()  { return this.x + this.size; }
    get top()    { return this.y - Math.sqrt(3)/2 * this.size; }
    get bottom() { return this.y + Math.sqrt(3)/2 * this.size; }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const ang = Math.PI/3 * i - Math.PI/6;
            const px = this.x + this.size * Math.cos(ang);
            const py = this.y + this.size * Math.sin(ang);
            i === 0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
        }
        ctx.closePath();
        ctx.fill();
    }

    intersects(other) {
        return super.intersects(other);
    }

    contains(point) {
        return (
            point.x >= this.left   &&
            point.x <  this.right  &&
            point.y >= this.top    &&
            point.y <  this.bottom
        );
    }
}
