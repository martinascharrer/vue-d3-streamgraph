<template>
    <g ref="axis">
        <line
            v-if="!horizontal"
            :x1="left"
            :y1="scale.y(ticks[0])"
            :x2="left"
            :y2="scale.y(ticks[ticks.length-1])"
            stroke="black"
        />

        <g
            v-for="(tick) in ticks"
            :key="tick"
            :transform="`translate(0, ${scale.y(tick)})`"
        >
            <line
                v-if="horizontal"
                :x1="left"
                :x2="layout.width - layout.margin.right"
            />
            <line
                v-else
                :x1="left - tickWidth"
                :x2="left"
            />
            <text
                alignment-baseline="middle"
                :style="`transform:translateX(${layout.margin.left - tickWidth - 5 }px)`"
            >
                {{ tick }}
            </text>
        </g>
    </g>
</template>

<script>
export default {
    name: 'YAxis',
    props: {
        scale: {
            type: Object,
            required: true
        },
        layout: {
            type: Object,
            required: true,
        },
        tickWidth: {
            type: Number,
            default: 10,
        },
        nrOfTicks: {
            type: Number,
            default: 10,
        },
        horizontal: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        left() {
            return this.layout.margin.left;
        },
        ticks() {
            return this.scale.y.ticks(this.nrOfTicks);
        }
    },
};
</script>

<style scoped>
line {
    stroke: #ccc;
    stroke-width: 1px;
}

text {
    fill: #888;
    font-size: 0.8em;
    text-anchor: end;
}
</style>