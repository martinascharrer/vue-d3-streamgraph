<template>
    <path
        :d="d"
        :fill="color"
        :class="{ active : isActive }"
        @click="$emit('clicked')"
    />
</template>

<script>
import { area as d3Area } from 'd3';

export default {
    name: 'PathAreaClickable',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        scales: {
            type: Object,
            default: () => {}
        },
        color: {
            type: String,
            default: () => '#000000'
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        d() {
            return this.calcArea(this.data);
        },
        calcArea() {
            let scales = this.scales;
            return d3Area()
                .x(function (d) {
                    return scales.x(d.x);
                })
                .y0(function (d) {
                    return scales.y(d.y0);
                })
                .y1(function (d) {
                    return scales.y(d.y1);
                });
        }
    }
};
</script>

<style scoped>
path {
    transition: d 500ms ease;
}

path:hover {
    opacity: 0.85;
}

.active {
    stroke: #222;
    stroke-width: 2px;
}
</style>