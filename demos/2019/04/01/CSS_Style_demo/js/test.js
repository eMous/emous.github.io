'use strict';
(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const w = c.width = window.innerWidth;
    const h = c.height = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;
    const create3Points = (o, l) => {
        const a = (Math.PI * 2) / 3;
        const p = [];

        for (let i = Math.PI / 2; i < (Math.PI * 2 + Math.PI / 2); i += a) {
            p.push({
                x: o.x + Math.cos(-i) * l,
                y: o.y + Math.sin(-i) * l,
            });
        }

        return p;
    };
    const draw = (ctx, p1, p2, d) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dd = Math.sqrt(dx * dx + dy * dy);
        const slice = dd / 3;
        const aa = Math.atan2(dy, dx);
        const a = {
            x: p1.x + Math.cos(aa) * slice,
            y: p1.y + Math.sin(aa) * slice,
        };
        const b = {
            x: a.x + Math.cos(aa - Math.PI / 3) * slice,
            y: a.y + Math.sin(aa - Math.PI / 3) * slice,
        };
        const c = {
            x: a.x + Math.cos(aa) * slice,
            y: a.y + Math.sin(aa) * slice,
        };

        if (d === 0) {
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();


            return;
        }

        draw(ctx, p1, a, d - 1);
        draw(ctx, a, b, d - 1);
        draw(ctx, b, c, d - 1);
        draw(ctx, c, p2, d - 1);
    };

    const points = create3Points({x: cx, y: cy}, h * 0.5).map((pt) => {
        return { x: pt.x, y: pt.y + h * 0.1 };
    });

    const [p1, p2, p3] = points;

    draw(ctx, p1, p2, 4);
    draw(ctx, p2, p3, 4);
    draw(ctx, p3, p1, 4);
})();