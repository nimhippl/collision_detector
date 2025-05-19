import Triangle from '../triangle'

describe('Triangle getters', () => {
    it('should calculate borders correctly', () => {
        const side = 4;
        const h = Math.sqrt(3) / 2 * side;
        const tri = new Triangle(10, 10, 0, 0, side);

        expect(tri.left).toBe(10 - side / 2);
        expect(tri.right).toBe(10 + side / 2);
        expect(tri.top).toBeCloseTo(10 - (2 * h) / 3);
        expect(tri.bottom).toBeCloseTo(10 + h / 3);
    });
});

describe('Triangle.draw()', () => {
    it('should draw a triangle via moveTo/lineTo/closePath/fill', () => {
        const ctx = {
            fillStyle: null,
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
        };
        const tri = new Triangle(20, 30, 0, 0, 6, 'rgb(7,8,9)');
        tri.draw(ctx);
        expect(ctx.fillStyle).toBe('rgb(7,8,9)');
        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalledTimes(1);
        expect(ctx.lineTo).toHaveBeenCalledTimes(2);
        expect(ctx.closePath).toHaveBeenCalled();
        expect(ctx.fill).toHaveBeenCalled();
    });
});

describe('Triangle.contains()', () => {
    let tri;
    beforeEach(() => {
        tri = new Triangle(10, 10, 0, 0, 4);
    });

    it('should return true for a point strictly inside its bounding box', () => {
        const px = 10, py = 10;
        expect(tri.contains({ x: px, y: py })).toBeTruthy();
    });

    it('should return true on left/top border', () => {
        expect(tri.contains({ x: tri.left,  y: (tri.top + tri.bottom) / 2 })).toBeTruthy();
        expect(tri.contains({ x: (tri.left + tri.right) / 2, y: tri.top })).toBeTruthy();
    });

    it('should return false on right/bottom border', () => {
        expect(tri.contains({ x: tri.right, y: (tri.top + tri.bottom) / 2 })).toBeFalsy();
        expect(tri.contains({ x: (tri.left + tri.right) / 2, y: tri.bottom })).toBeFalsy();
    });

    it('should return false for a point outside bounding box', () => {
        expect(tri.contains({ x: tri.right + 1, y: tri.bottom + 1 })).toBeFalsy();
    });
});

describe('Triangle.intersects()', () => {
    let tri;
    beforeEach(() => {
        tri = new Triangle(10, 10, 0, 0, 4);
    });

    it('should return true for overlapping bounding boxes', () => {
        const other = new Triangle(11,  9, 0, 0, 4);
        expect(tri.intersects(other)).toBeTruthy();
    });

    it('should return false for non-overlapping bounding boxes', () => {
        const other = new Triangle(100,100, 0, 0, 4);
        expect(tri.intersects(other)).toBeFalsy();
    });
});