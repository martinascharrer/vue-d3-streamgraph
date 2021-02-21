<template>
    <g class="xselector">
        <path
            :d="d"
            class="xselector__selector"
        />
        <g
            v-if="hasDots"
            class="xselector__dots"
        >
            <circle
                v-for="dot in dotData"
                :key="dot.key" r="5"
                :cx="data[0].x"
                :cy="dot.value"
                :fill="dot.color"
                class="xselector__dot"
            />
        </g>
    </g>
</template>

<script>
import { line as d3Line } from 'd3';

export default {
    name: 'XSelector',
    props: {
        data: {
            type: Array
        },
        hasDots: {
            type: Boolean,
            default: false,
        },
        dotData: {
            type: Array,
        }
    },
    computed: {
        d() {
            return this.createLine(this.data);
        }
    },
    methods: {
        createLine: d3Line()
            .x(d => d.x)
            .y(d => d.y)
    }
};
</script>

<style scoped>
path {
    stroke: #888;
    stroke-width: 1px;
    stroke-dasharray: 5px;
    stroke-dashoffset: 5px;
    transition: all 200ms;
}

.xselector__dot {
    stroke: #fff;
    stroke-width: 2px;
    transition: all 200ms;
}
</style>