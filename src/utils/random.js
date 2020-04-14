import * as d3 from "d3";
import {stackOffsetBaseline} from "d3";

const n = 200;
const m = 200;
const k = 200;
const y = d3.scaleLinear([0, 1], [200, 0]);

let stack = d3.stack()
    .keys(d3.range(n))
    .offset(stackOffsetBaseline)
    .order(d3.stackOrderNone)

function randomize() {
    const layers = stack(d3.transpose(Array.from({length: n}, () => bumps(m, k))));
    y.domain([
        d3.min(layers, l => d3.min(l, d => d[0])),
        d3.max(layers, l => d3.max(l, d => d[1]))
    ]);
    return layers;
}

function bump(a, n) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < n; ++i) {
        const w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
    }
}

function bumps(n, m) {
    const a = [];
    for (let i = 0; i < n; ++i) a[i] = 0;
    for (let i = 0; i < m; ++i) bump(a, n);
    return a;
}

export const randomStackData = randomize();