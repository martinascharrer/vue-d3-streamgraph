import { color } from '../../utils/colors';
import {
    stackOffsetSilhouette as d3StackOffsetSilhouette,
    interpolateViridis as d3interpolateViridis,
} from 'd3';

export const StreamGraphMixin = {
    props: {
        origData: {
            type: Array,
            default: () => undefined
        },
        layout: {
            type: Object,
            default: () => {}
        },
        colorArray: {
            type: Array,
        },
        colorInterpolation: {
            type: Function,
            default: d3interpolateViridis,
        },
        stackOffset: {
            type: Function,
            default: d3StackOffsetSilhouette
        },
        hasSelector: {
            type: Boolean,
            default: false,
        },
        hasSelectorDots: {
            type: Boolean,
            default: false,
        },
        isClickable: {
            type: Boolean,
            default: false,
        },
        hasXAxis: {
            type: Boolean,
            default: true,
        },
        hasYAxis: {
            type: Boolean,
            default: true,
        },
        tickWidth: {
            type: Number,
        },
        nrOfXTicks: {
            type: Number,
            default: 10,
        },
        nrOfYTicks: {
            type: Number,
            default: 10,
        },
        xAxisLong: {
            type: Boolean,
            default: false,
        },
        yAxisLong: {
            type: Boolean,
            default: false,
        },
        xAxisHasLines: {
            type: Boolean,
            default: true,
        },
        xAxisHasEndLine: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        yKeys() {
            if (this.origData.columns !== undefined) return this.origData.columns.slice(1);
            return Object.keys(this.origData[0]).slice(1);
        },
        xKey() {
            if (this.origData.columns !== undefined) return this.origData.columns[0];
            return Object.keys(this.origData[0])[0];
        },
        color() {
            return color(this.colorArray, this.colorInterpolation, this.yKeys);
        }
    },
};