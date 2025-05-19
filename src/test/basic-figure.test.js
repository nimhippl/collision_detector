import BasicFigure from '../basic-figure'

describe('BasicFigure getters', () => {
    it('should return correct left/right/top/bottom for a point', () => {
        const fig = new BasicFigure(5, 7, 0, 0);
        expect(fig.left).toBe(5);
        expect(fig.right).toBe(5);
        expect(fig.top).toBe(7);
        expect(fig.bottom).toBe(7);
    });
});

describe('BasicFigure.move()', () => {
    it('should update x and y by vx and vy', () => {
        const fig = new BasicFigure(1, 2, 3, 4);
        fig.move();
        expect(fig.x).toBe(4);
        expect(fig.y).toBe(6);
    });
});

describe('BasicFigure.bounce()', () => {
    it('should invert vx when reaching left/right bounds', () => {
        const fig = new BasicFigure(0, 0, -5, 0);
        fig.bounce(100, 100);
        expect(fig.vx).toBe(5);
        fig.x = 100; fig.vx = 6;
        fig.bounce(100, 100);
        expect(fig.vx).toBe(-6);
    });
    it('should invert vy when reaching top/bottom bounds', () => {
        const fig = new BasicFigure(0, 0, 0, -5);
        fig.bounce(100, 100);
        expect(fig.vy).toBe(5);
        fig.y = 100; fig.vy = 7;
        fig.bounce(100, 100);
        expect(fig.vy).toBe(-7);
    });
});

describe('BasicFigure.markCollision & isDead()', () => {
    it('should increment collisions and change color', () => {
        const fig = new BasicFigure(0, 0, 0, 0, 'rgb(1,1,1)');
        const spy = jest.spyOn(BasicFigure, 'randomColor').mockReturnValue('rgb(2,2,2)');
        fig.markCollision();
        expect(fig.collisions).toBe(1);
        expect(fig.color).toBe('rgb(2,2,2)');
        spy.mockRestore();
    });
    it('should report dead only after 3 collisions', () => {
        const fig = new BasicFigure(0, 0, 0, 0);
        expect(fig.isDead()).toBe(false);
        fig.collisions = 2;
        expect(fig.isDead()).toBe(false);
        fig.collisions = 3;
        expect(fig.isDead()).toBe(true);
    });
});

describe('BasicFigure.intersects()', () => {
    it('should use point intersection for point-figures', () => {
        const a = new BasicFigure(10, 10, 0, 0);
        const b = new BasicFigure(10, 10, 0, 0);
        const c = new BasicFigure(11, 10, 0, 0);
        expect(a.intersects(b)).toBe(true);
        expect(a.intersects(c)).toBe(false);
    });
});

describe('BasicFigure.bounce() — дополнительные кейсы', () => {
    it('should not invert any velocity when shape is well inside bounds', () => {
        const fig = new BasicFigure(50, 50, 2, 3);
        fig.bounce(100, 100);
        expect(fig.vx).toBe(2);
        expect(fig.vy).toBe(3);
    });

    it('should invert both vx and vy when shape is at the top-left corner', () => {
        const fig = new BasicFigure(0, 0, -4, -6);
        fig.bounce(100, 100);
        expect(fig.vx).toBe(4);
        expect(fig.vy).toBe(6);
    });
});
