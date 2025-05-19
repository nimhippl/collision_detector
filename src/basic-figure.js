export default class BasicFigure {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color || BasicFigure.randomColor();
        this.collisions = 0;
    }
    get left()   { return this.x; }
    get right()  { return this.x; }
    get top()    { return this.y; }
    get bottom() { return this.y; }
    move() {
        this.x += this.vx;
        this.y += this.vy;
    }
    bounce(width, height) {
        if (this.left  <= 0 || this.right  >= width)  this.vx *= -1;
        if (this.top   <= 0 || this.bottom >= height) this.vy *= -1;
    }
    markCollision() {
        this.collisions += 1;
        this.color = BasicFigure.randomColor();
    }
    isDead() {
        return this.collisions >= 3;
    }
    static randomColor() {
        const r = 50 + Math.round(Math.random()*205);
        const g = 50 + Math.round(Math.random()*205);
        const b = 50 + Math.round(Math.random()*205);
        return `rgb(${r},${g},${b})`;
    }
    intersects(other) {
        return !(
        other.left   > this.right  ||
        other.right  < this.left   ||
        other.top    > this.bottom ||
        other.bottom < this.top
        );
    }
}
