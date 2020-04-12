<template>
    <div class="bar-chart">
        <h2 v-if="title">{{ title }}</h2>
        <div class="bar-chart__chart"
             :style="`height: ${ graphHeight }px; width: ${ graphWidth }px;
             padding-left:${ layout.margin.left }px; padding-top:${ layout.margin.top }px;
             padding-right:${ layout.margin.right }px; padding-bottom:${ layout.margin.bottom }px;`"
        >
            <div class="bar-chart__axisContainer">
                <div v-for="tick in ticks" :key="tick" :style="`transform: translateX(${ scaleX(tick) }px)`">
                    <span class="bar-chart__axis" :style="`height: ${layout.height - 20}px`"></span>
                    <p class="bar-chart__axisLabel" :style="`margin-top: ${layout.height - 15}px`">{{ tick }}</p>
                </div>
            </div>

            <div
                    v-for="(d, i) in data"
                    :key="d.label+i" class="bar-chart__line"
            >
                <span
                        class="bar-chart__bar"
                     :style="`width: ${scaleX(d.value)}px; height: ${barWidth}px; background: ${d.color}`"
                >
                </span>
                <span class="bar-chart__label">{{ d.label }}</span>
            </div>
            <XAxisBottom :layout="layout" :scale="{ x: scaleX }"/>
        </div>
    </div>
</template>

<script>
import { scaleLinear as d3ScaleLinear } from 'd3-scale';

import XAxisBottom from "./XAxisBottom";

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
            required: true,
        },
        barWidth: {
            type: Number,
            required: true,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
        nrOfAxis: {
            required: true,
        }
    },
    components: {
      XAxisBottom,
    },
    computed: {
        graphHeight() {
            return (
                this.layout.height
            );
        },
        graphWidth() {
            return (
                this.layout.width
            );
        },
        ticks() {
            return this.scaleX.ticks(this.nrOfAxis);
        },
        scaleX() {
            return d3ScaleLinear()
                .domain([ this.min, this.max ])
                .range([ 0, this.layout.width - this.layout.margin.right ]);
        },
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

.bar-chart__chart {
    display: flex;
    flex-direction: column;
    justify-content: left;
}

.bar-chart__axisContainer {
    position: fixed;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bar-chart__axis {
    position: fixed;
    width:1px;
    height: 200px;
    background: #e2e2e7;
    z-index: 0;
}

.bar-chart__axisLabel {
    position: fixed;
    color: #ccc;
    z-index: 0;
}

.bar-chart__line {
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
}

.bar-chart__label {
    z-index: 1;
    margin-left: 0.5em;
}

.bar-chart__bar {
    transition: all 1s;
}
</style>