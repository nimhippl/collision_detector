import Rectangle from "./rectangle";
import Circle    from "./circle";
import Triangle  from "./triangle";
import Hexagon   from "./hexagon";
import QuadTree  from "./quad-tree";

const canvas = document.getElementById("cnvs");
const ctx    = canvas.getContext("2d");
const gameState = {};

let useQuadTree = false;

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
        gameState.lastTick += gameState.tickLength;
        update();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameState.figures.forEach(fig => {
        // у всех наших фигур теперь есть метод draw()
        fig.draw(ctx);
    });
}

function update() {
    // движение + отскок
    gameState.figures.forEach(fig => {
        fig.move();
        fig.bounce(canvas.width, canvas.height);
        fig._hasCollidedThisFrame = false;
    });

    if (useQuadTree) {
        const boundary = new Rectangle(0, 0, canvas.width, canvas.height);
        const qt = new QuadTree(boundary, 4);
        gameState.figures.forEach(f => qt.insert(f));
        gameState.figures.forEach(f => {
            qt.queryRange(f).forEach(other => {
                if (
                    other !== f &&
                    !f._hasCollidedThisFrame &&
                    f.intersects(other)
                ) {
                    f.markCollision();
                    other.markCollision();
                    f._hasCollidedThisFrame = other._hasCollidedThisFrame = true;
                }
            });
        });
    } else {
        // наивная проверка столкновений
        const figs = gameState.figures;
        for (let i = 0; i < figs.length; i++) {
            for (let j = i + 1; j < figs.length; j++) {
                const A = figs[i], B = figs[j];
                if (A.intersects(B)) {
                    A.markCollision();
                    B.markCollision();
                }
            }
        }
    }

    // удаляем dead
    gameState.figures = gameState.figures.filter(fig => !fig.isDead());

    // диалоги при 1 и 0 оставшихся фигурах
    if (gameState.figures.length === 1 && !gameState.promptedSingle) {
        gameState.promptedSingle = true;
        requestAnimationFrame(() => setTimeout(() => {
            if (confirm("Уничтожить одинокого воина?")) gameState.figures = [];
        }, 500));
    }
    if (gameState.figures.length === 0 && !gameState.alertedAll) {
        gameState.alertedAll = true;
        requestAnimationFrame(() => setTimeout(() => {
            alert("Все воины уничтожены, милорд");
        }, 500));
    }
}

function run(tFrame) {
    gameState.stopCycle = requestAnimationFrame(run);

    const nextTick = gameState.lastTick + gameState.tickLength;
    let numTicks = 0;
    if (tFrame > nextTick) {
        numTicks = Math.floor((tFrame - gameState.lastTick) / gameState.tickLength);
    }

    queueUpdates(numTicks);
    draw();
    gameState.lastRender = tFrame;
}

function setup() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    gameState.lastTick   = performance.now();
    gameState.lastRender = gameState.lastTick;
    gameState.tickLength = 15;
    gameState.promptedSingle = false;
    gameState.alertedAll    = false;

    gameState.figures = [];

    // создаём по 10 фигур каждого типа
    for (let i = 0; i < 10; i++) {
        gameState.figures.push(new Circle(
            rand(20, canvas.width  - 20),
            rand(20, canvas.height - 20),
            rand(-3, 3), rand(-3, 3),
            rand(10, 20)
        ));
        gameState.figures.push(new Triangle(
            rand(20, canvas.width  - 20),
            rand(20, canvas.height - 20),
            rand(-3, 3), rand(-3, 3),
            rand(20, 40)
        ));
        gameState.figures.push(new Hexagon(
            rand(20, canvas.width  - 20),
            rand(20, canvas.height - 20),
            rand(-3, 3), rand(-3, 3),
            rand(15, 30)
        ));
    }

    run();
}

function randInit(minSize, maxSize) {
    return [
        rand(20, canvas.width - 20),
        rand(20, canvas.height - 20),
        rand(-3, 3),
        rand(-3, 3),
        rand(minSize, maxSize)
    ];
}

function initSimulation(N) {
    gameState.figures = [];
    const perType = Math.ceil(N / 3);
    for (let i = 0; i < perType; i++) {
        gameState.figures.push(new Circle(...randInit(10,20)));
        gameState.figures.push(new Triangle(...randInit(20,40)));
        gameState.figures.push(new Hexagon(...randInit(15,30)));
    }
    gameState.figures.length = N;
}

// копия update для бенчмарка без удаления и без диалогов
function updateBenchmark() {
    gameState.figures.forEach(fig => {
        fig.move();
        fig.bounce(canvas.width, canvas.height);
        fig._hasCollidedThisFrame = false;
    });

    if (useQuadTree) {
        const boundary = new Rectangle(0, 0, canvas.width, canvas.height);
        const qt = new QuadTree(boundary, 4);
        gameState.figures.forEach(f => qt.insert(f));
        gameState.figures.forEach(f => {
            qt.queryRange(f).forEach(other => {
                if (other !== f && !f._hasCollidedThisFrame && f.intersects(other)) {
                    f.markCollision();
                    other.markCollision();
                    f._hasCollidedThisFrame = other._hasCollidedThisFrame = true;
                }
            });
        });
    } else {
        const figs = gameState.figures;
        for (let i = 0; i < figs.length; i++) {
            for (let j = i + 1; j < figs.length; j++) {
                const A = figs[i], B = figs[j];
                if (A.intersects(B)) {
                    A.markCollision();
                    B.markCollision();
                }
            }
        }
    }
}

// ищем максимальное N, при котором среднее время кадра  ≤ maxFrameMs
async function findMaxN(mode, maxFrameMs = 30, maxN = 100000) {
    useQuadTree = (mode === 'quadtree');
    console.log(`\n=== Поиск предела для ${mode} (порог ${maxFrameMs} ms) ===`);
    let N = 100;
    while (N <= maxN) {
        initSimulation(N);
        for (let i = 0; i < 5; i++) {
            updateBenchmark();
            draw();
        }
        // измеряем среднее по 5 запускам
        let total = 0, runs = 5;
        for (let k = 0; k < runs; k++) {
            const t0 = performance.now();
            updateBenchmark();
            draw();
            total += performance.now() - t0;
        }
        const avg = total / runs;
        console.log(`${mode} @ N=${N}: ${avg.toFixed(2)} ms`);
        if (avg > maxFrameMs) {
            console.log(`→ Предел для ${mode}: N ≈ ${N}`);
            return N;
        }
        N = Math.floor(N * 1.5);
        await new Promise(r => setTimeout(r, 0));
    }
    console.log(`→ Не достигнут предел до N = ${maxN}`);
    return maxN;
}

async function autoFindLimits() {
    const n1 = await findMaxN('naive',    30, 100000);
    const n2 = await findMaxN('quadtree', 30, 100000);
    console.log(`\n=== Результаты ===\nНаивный:    ${n1}\nQuadTree:   ${n2}`);
}

// для консоли
window.findMaxN      = findMaxN;
window.autoFindLimits = autoFindLimits;

setup();
