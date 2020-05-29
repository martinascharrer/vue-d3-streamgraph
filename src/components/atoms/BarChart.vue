<template>
    <div class="bar-chart">
        <h2 v-if="title" :style="`margin-left:${layout.margin.left}px;`">{{ title }}</h2>
        <svg
            :width="layout.width"
            :height="layout.height"
        >
            <x-axis
                :scale="{ x: scaleX }"
                :layout="layout"
                :tick-width="10"
                :nr-of-ticks="nrOfTicks"
                :vertical="true"
            />
            <g
                v-for="(d, i) in data"
                :key="d.label"
                class="bar-chart__line"
                :transform="`translate(${layout.margin.left}, ${layout.margin.top})`"
            >
                <rect
                    class="bar-chart__bar"
                    :width="getBarWidth(d.value)"
                    :height="barWidth"
                    :y="i * barOffset"
                    :fill="d.color"
                >
                </rect>
                <text
                    class="bar-chart__label"
                    :transform="`translate(${getBarWidth(d.value) + 5}, ${i * barOffset + ( barWidth / 2 )})`"
                    :x="0"
                    :y="0"
                >
                    {{ d.label }}
                </text>
            </g>
        </svg>
    </div>
</template>

<script>
import { scaleLinear as d3ScaleLinear } from 'd3-scale';

import XAxis from "./XAxis";

export default {
    name: "BarChart",
    props: {
        title: {
            type: String,
            required: false,
        },
        data: {
            type: Array,
            required: true,
        },
        layout: {
            type: Object,
            required: true,
        },
        barWidth: {
            type: Number,
            default: 15,
        },
        spaceBetweenBars: {
            type: Number,
            default: 10,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
        nrOfTicks: {
            type: Number,
        }
    },
    components: {
      XAxis,
    },
    computed: {
        barOffset() {
            return this.barWidth + this.spaceBetweenBars;
        },
        ticks() {
            return this.scaleX.ticks(this.nrOfTicks);
        },
        scaleX() {
            return d3ScaleLinear()
                .domain([ this.min, this.max ])
                .range([ this.layout.margin.left, this.layout.width - this.layout.margin.right ]);
        },
    },
    methods: {
        getBarWidth(value) {
            return this.scaleX(value) - this.layout.margin.left;
        }
    }
}
</script>

<style scoped>
.bar-chart {
    border: 2px solid #e2e2e7;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.bar-chart__label {
    transition: transform 1s;
    alignment-baseline: middle;
}

.bar-chart__bar {
    transition: width 1s;
}
</style>