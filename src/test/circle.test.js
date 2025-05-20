import Circle from '../circle.js'

describe('Circle getters', () => {
    it('should calculate left/right/top/bottom using radius', () => {
        const c = new Circle(20, 30, 0, 0, 5);
        expect(c.left).toBe(15);
        expect(c.right).toBe(25);
        expect(c.top).toBe(25);
        expect(c.bottom).toBe(35);
    });
});

describe('Circle.contains()', () => {
    let c;
    beforeEach(() => {
        c = new Circle(50, 50, 0, 0, 10);
    });

    it('should return true for a point strictly inside the bounding box', () => {
        expect(c.contains({ x: 50, y: 50 })).toBeTruthy();
        expect(c.contains({ x: 45, y: 55 })).toBeTruthy();
    });

    it('should return true on left or top border', () => {
        expect(c.contains({ x: c.left,  y:  50 })).toBeTruthy();
        expect(c.contains({ x: 50,    y: c.top })).toBeTruthy();
    });

    it('should return false on right or bottom border', () => {
        expect(c.contains({ x: c.right, y:  50 })).toBeFalsy();
        expect(c.contains({ x: 50,   y: c.bottom })).toBeFalsy();
    });

    it('should return false for a point outside the bounding box', () => {
        expect(c.contains({ x: 0, y: 0 })).toBeFalsy();
        expect(c.contains({ x: 100, y: 100 })).toBeFalsy();
    });
});

describe('Circle.intersects()', () => {
    it('should detect circle–circle collision by distance', () => {
        const c1 = new Circle(0, 0, 0, 0, 10);
        const c2 = new Circle(15, 0, 0, 0, 10);
        expect(c1.intersects(c2)).toBe(true);
        const c3 = new Circle(21, 0, 0, 0, 10);
        expect(c1.intersects(c3)).toBe(false);
    });

    it('should fall back to AABB for other shapes', () => {
        const c = new Circle(50, 50, 0, 0, 5);
        const other = { left: 40, right: 60, top: 40, bottom: 60 };
        expect(c.intersects(other)).toBe(true);
        other.left = 100; other.top = 100;
        expect(c.intersects(other)).toBe(false);
    });
});

describe('Circle.draw()', () => {
    it('should set fillStyle, call beginPath, arc and fill', () => {
        const ctx = {
            fillStyle: null,
            beginPath: jest.fn(),
            arc: jest.fn(),
            fill: jest.fn()
        };
        const c = new Circle(12, 34, 0, 0, 7, 'rgb(123,45,67)');
        c.draw(ctx);
        expect(ctx.fillStyle).toBe('rgb(123,45,67)');
        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.arc).toHaveBeenCalledWith(12, 34, 7, 0, 2 * Math.PI);
        expect(ctx.fill).toHaveBeenCalled();
    });
});
