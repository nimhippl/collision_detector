import BasicFigure from './basic-figure.js';

export default class Rectangle extends BasicFigure {
    constructor(x, y, w, h, color) {
        super(x, y, 0, 0, color);
        this.w = w;
        this.h = h;
    }

    setSpeed(x, y) {
        this.vx = x;
        this.vy = y;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.w;
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.h;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    intersects(other) {
        return !(
            other.left > this.right ||
            other.right < this.left ||
            other.top > this.bottom ||
            other.bottom < this.top
        );
    }

    contains(point) {
        return (point.x >= this.x &&
            point.x < this.x + this.w &&
            point.y >= this.y &&
            point.y < this.y + this.h)
    }
}
