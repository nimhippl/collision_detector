import BasicFigure from './basic-figure.js';
export default class Triangle extends BasicFigure {
    constructor(x, y, vx, vy, side, color) {
        super(x, y, vx, vy,  color);
        this.side = side;
        this.h = Math.sqrt(3)/2 * side;
    }
    get left()   { return this.x - this.side/2; }
    get right()  { return this.x + this.side/2; }
    get top()    { return this.y - this.h*2/3; }
    get bottom() { return this.y + this.h*1/3; }
    draw(ctx) {
        const x = this.x, y = this.y;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(x, y - 2*this.h/3);
        ctx.lineTo(x - this.side/2, y + this.h/3);
        ctx.lineTo(x + this.side/2, y + this.h/3);
        ctx.closePath();
        ctx.fill();
    }
    intersects(other) {
        return !(
            other.left   > this.right ||
            other.right  < this.left  ||
            other.top    > this.bottom||
            other.bottom < this.top
        );
    }
    contains(point) {
        return (
            point.x >= this.left &&
            point.x <  this.right &&
            point.y >= this.top &&
            point.y <  this.bottom
        );
    }
}
