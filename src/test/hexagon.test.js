import Hexagon from '../hexagon'

describe('Hexagon getters', () => {
    it('should calculate left/right/top/bottom using bounding box', () => {
        const size = 10;
        const hbox = Math.sqrt(3)/2 * size;
        const h = new Hexagon(50, 60, 0, 0, size);

        expect(h.left).toBe(40);
        expect(h.right).toBe(60);
        expect(h.top).toBeCloseTo(60 - hbox);
        expect(h.bottom).toBeCloseTo(60 + hbox);
    });
});

describe('Hexagon.draw()', () => {
    it('should draw a 6-sided polygon via canvas API', () => {
        const ctx = {
            fillStyle: null,
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
        };
        const h = new Hexagon(10, 20, 0, 0, 5, 'rgb(1,2,3)');
        h.draw(ctx);
        expect(ctx.fillStyle).toBe('rgb(1,2,3)');
        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalledTimes(1);
        expect(ctx.lineTo).toHaveBeenCalledTimes(5);
        expect(ctx.closePath).toHaveBeenCalled();
        expect(ctx.fill).toHaveBeenCalled();
    });
});

describe('Hexagon.intersects()', () => {
    it('should delegate to BasicFigure AABB logic', () => {
        const h = new Hexagon(0, 0, 0, 0, 5);
        const inside  = { left: -1, right: 1, top: -1, bottom: 1 };
        const outside = { left: 100, right: 110, top: 100, bottom: 110 };
        expect(h.intersects(inside)).toBe(true);
        expect(h.intersects(outside)).toBe(false);
    });
});

describe('Hexagon.contains()', () => {
    let h;
    beforeEach(() => {
        h = new Hexagon(30, 40, 0, 0, 8);
    });

    it('should return true for a point strictly inside its bounding box', () => {
        expect(h.contains({ x: 30, y: 40 })).toBeTruthy();
    });

    it('should return true on left or top border', () => {
        expect(h.contains({ x: h.left,  y: (h.top + h.bottom)/2 })).toBeTruthy();
        expect(h.contains({ x: (h.left + h.right)/2, y: h.top })).toBeTruthy();
    });

    it('should return false on right or bottom border', () => {
        expect(h.contains({ x: h.right, y: (h.top + h.bottom)/2 })).toBeFalsy();
        expect(h.contains({ x: (h.left + h.right)/2, y: h.bottom })).toBeFalsy();
    });

    it('should return false for a point outside the bounding box', () => {
        expect(h.contains({ x: h.right + 1, y: h.bottom + 1 })).toBeFalsy();
    });
});