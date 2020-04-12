<template>
    <div>
    <h3 v-if="title">{{ title }}</h3>
        <div class="bar-chart" :style="`height: ${graphHeight}px; width: ${graphWidth}px`">
            <div v-for="i in nrOfAxis" :key="i" :style="`transform: translateX(${i*xMaxSeparate}px)`">
                <span class="bar-chart__axis"></span>
                <p class="bar-chart__axisLabel">{{ i * xMaxSeparate }}</p>
            </div>
            <div v-for="(d, i) in data" :key="d.label+i" class="bar-chart__line">
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
        extremes: {
          required: true,
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
        xMin() {
            return Math.min(...this.values);
        },
        xMax() {
            return Math.max(...this.values);
        },
        xMaxSeparate() {
            return this.scaleX(50000) / this.nrOfAxis;
        },
        values() {
            let values = [];
            for(let i=0; i < this.data.length; i++){
                values.push(this.data[i].value);
            }
            return values;
        },
        scaleX() {
            return d3ScaleLinear()
                .domain([0, 50000])
                .range([
                    0, this.layout.width - this.layout.margin.right
                ]);
        },
    }
}
</script>

<style scoped>
.bar-chart {
    display: flex;
    flex-direction: column;
}

.bar-chart__axis {
    position: fixed;
    width:1px;
    height: 200px;
    background: #ccc;
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
    margin-left: 0.5em;
}

.bar-chart__bar {
    transition: all 1s;
}
</style>