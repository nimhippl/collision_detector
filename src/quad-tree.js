import Rectangle from './rectangle.js'

export default class QuadTree {
    constructor(boundary, capacity = 4) {
        if (!boundary) {
            throw new TypeError('boundary is null or undefined');
        }
        if (!(boundary instanceof Rectangle)) {
            throw new TypeError('boundary should be a Rectangle');
        }

        this._boundary   = boundary;
        this._capacity   = capacity;
        this._points     = [];
        this._hasChildren = false;
        this._children    = [];
    }

    insert(shape) {
        if (!this._boundary.intersects(shape)) {
            return false;
        }

        if (this._points.length < this._capacity) {
            this._points.push(shape);
            return true;
        }

        if (!this._hasChildren) {
            this._subdivide();
        }

        for (const child of this._children) {
            if (child.insert(shape)) {
                return true;
            }
        }

        this._points.push(shape);
        return true;
    }

    get length() {
        let cnt = this._points.length;
        if (this._hasChildren) {
            for (const child of this._children) {
                cnt += child.length;
            }
        }
        return cnt;
    }

    queryRange(range, found = []) {
        if (!this._boundary.intersects(range)) {
            return found;
        }

        for (const p of this._points) {
            if (p.intersects(range)) {
                found.push(p);
            }
        }

        if (this._hasChildren) {
            for (const child of this._children) {
                child.queryRange(range, found);
            }
        }

        return found;
    }

    _subdivide() {
        const { x, y, w, h } = this._boundary;
        const hw = w / 2;
        const hh = h / 2;

        // Верхний левый
        this._children.push(
            new QuadTree(new Rectangle(x,      y,      hw, hh), this._capacity)
        );
        // Верхний правый
        this._children.push(
            new QuadTree(new Rectangle(x + hw, y,      hw, hh), this._capacity)
        );
        // Нижний левый
        this._children.push(
            new QuadTree(new Rectangle(x,      y + hh, hw, hh), this._capacity)
        );
        // Нижний правый
        this._children.push(
            new QuadTree(new Rectangle(x + hw, y + hh, hw, hh), this._capacity)
        );

        this._hasChildren = true;
    }

    clear() {
        this._points.length = 0;
        this._children.forEach(child => child.clear());
        this._children.length = 0;
        this._hasChildren = false;
    }
}
