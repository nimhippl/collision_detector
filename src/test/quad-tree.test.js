import Rectangle from '../rectangle'
import QuadTree  from '../quad-tree'
import BasicFigure from '../basic-figure'

describe('QuadTree initial state', () => {
    it('should be empty and not subdivided', () => {
        const boundary = new Rectangle(0, 0, 100, 100);
        const qt = new QuadTree(boundary, 2);
        expect(qt.length).toBe(0);
        // внутренний флаг _hasChildren должен быть false
        expect(qt._hasChildren).toBe(false);
    });

    it('should throw when boundary is missing or invalid', () => {
        expect(() => new QuadTree()).toThrow(TypeError);
        expect(() => new QuadTree(42)).toThrow(TypeError);
    });
});

describe('QuadTree.insert()', () => {
    let qt, boundary;
    beforeEach(() => {
        boundary = new Rectangle(0, 0, 10, 10);
        qt = new QuadTree(boundary, 1); // capacity = 1 to force subdivide quickly
    });

    it('should insert up to capacity without subdividing', () => {
        const a = new BasicFigure(1, 1, 0, 0);
        expect(qt.insert(a)).toBe(true);
        expect(qt.length).toBe(1);
        expect(qt._hasChildren).toBe(false);
    });

    it('should subdivide when capacity exceeded', () => {
        const a = new BasicFigure(1, 1, 0, 0);
        const b = new BasicFigure(2, 2, 0, 0);
        expect(qt.insert(a)).toBe(true);
        expect(qt.insert(b)).toBe(true);
        expect(qt.length).toBe(2);
        expect(qt._hasChildren).toBe(true);
        // Все потомки созданы
        expect(qt._children.length).toBe(4);
        // Каждый потомок — QuadTree с тот же capacity
        qt._children.forEach(child => {
            expect(child instanceof QuadTree).toBe(true);
            expect(child._capacity).toBe(1);
        });
    });

    it('should return false if shape is outside boundary', () => {
        const outside = new BasicFigure(20, 20, 0, 0);
        expect(qt.insert(outside)).toBe(false);
        expect(qt.length).toBe(0);
        expect(qt._hasChildren).toBe(false);
    });
});

describe('QuadTree.queryRange()', () => {
    it('should return only shapes whose bounding-box intersects the query', () => {
        const qt = new QuadTree(new Rectangle(0, 0, 50, 50), 4);
        const inside  = new BasicFigure(10, 10, 0, 0);
        const outside = new BasicFigure(100,100, 0, 0);
        qt.insert(inside);
        qt.insert(outside);

        const found = qt.queryRange(new Rectangle(0, 0, 20, 20));
        expect(found).toContain(inside);
        expect(found).not.toContain(outside);
    });

    it('should return empty array if query does not intersect this node', () => {
        const qt = new QuadTree(new Rectangle(0, 0, 50, 50), 4);
        const inside = new BasicFigure(10, 10, 0, 0);
        qt.insert(inside);

        const found = qt.queryRange(new Rectangle(100, 100, 10, 10));
        expect(found).toEqual([]);
    });
});

describe('QuadTree.clear()', () => {
    it('should remove all shapes and reset subdivision', () => {
        const qt = new QuadTree(new Rectangle(0, 0, 10, 10), 1);
        qt.insert(new BasicFigure(1,1,0,0));
        qt.insert(new BasicFigure(2,2,0,0));
        expect(qt._hasChildren).toBe(true);
        expect(qt.length).toBe(2);

        qt.clear();
        expect(qt.length).toBe(0);
        expect(qt._hasChildren).toBe(false);
        expect(qt._children.length).toBe(0);
    });
});