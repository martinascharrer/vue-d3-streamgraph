<template>
    <g>
        <pattern
            id="diagonalHatch"
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
        >
            <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
                  style="stroke:white; stroke-width:1"/>
        </pattern>
        <path
            :d="d"
            :fill="fillColor"
            @click="$emit('clicked')"
            :class="{ active: isActive, 'path-area': true }"
        />
    </g>

</template>

<script>
import { area as d3Area } from "d3";

export default {
    name: "PathArea",
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        xKey: {
            type: String,
            default: 'asdf',
        },
        scales: {
            type: Object,
            default: () => {
            },
        },
        color: {
            type: String,
            default: () => "#000000",
        },
        isActive: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    computed: {
        area() {
            let that = this;
            return d3Area()
                .x(function (d) {
                    return that.scales.x(d.data[that.xKey]);
                })
                .y0(function (d) {
                    return that.scales.y(d[0]);
                })
                .y1(function (d) {
                    return that.scales.y(d[1]);
                });
        },
        d() {
            return this.area(this.data);
        },
        fillColor() {
            return this.isActive ? 'url(#diagonalHatch)' : this.color;
        }
    }
};
</script>

<style scoped>
.path-area {
    transition: all 200ms ease;
}

.active {
    transition: opacity 1s;
    stroke: #fff;
    stroke-width: 1px;
}
</style>