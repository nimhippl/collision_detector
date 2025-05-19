import BasicFigure from './basic-figure.js';
export default class Circle extends BasicFigure {
    constructor(x,y,vx,vy,r, color) {
        super(x,y,vx,vy, color);
        this.r = r;
    }
    get left()   { return this.x - this.r; }
    get right()  { return this.x + this.r; }
    get top()    { return this.y - this.r; }
    get bottom() { return this.y + this.r; }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
    }
    intersects(other) {
        if (other instanceof Circle) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            return dx*dx + dy*dy <= (this.r + other.r)**2;
        }
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
            point.y >= this.top  &&
            point.y <  this.bottom
        );
    }
}
