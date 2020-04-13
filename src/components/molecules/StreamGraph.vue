<template>
    <svg
      class="stream-graph"
      :width="layout.width"
      :height="layout.height"
      @mousemove="mouseMoved"
      @mouseleave="$emit('mouseleft')"
    >
      <x-axis
        v-if="hasXAxis"
        :scale="{ x:scaleX, y:scaleY }"
        :layout="layout"
        :tick-width="tickWidth"
        :nrOfTicks="nrOfXTicks"
        :vertical="xAxisLong"
        :has-lines="xAxisHasLines"
        :has-end-line="xAxisHasEndLine"
      />
      <y-axis
        v-if="hasYAxis"
        :scale="{ x:scaleX, y:scaleY }"
        :layout="layout"
        :tick-width="tickWidth"
        :nrOfTicks="nrOfYTicks"
        :horizontal="yAxisLong"
      />
      <transition-group tag="g" name="fade">
        <path-area
          v-for="d in stackedData"
          :key="d.key"
          :data="d"
          :layout="layout"
          :scales="{ x:scaleX, y:scaleY }"
          :color="color(d.key)"
          @clicked="pathAreaClicked(d.key, d)"
        />
      </transition-group>
      <transition name="fade">
        <path-area
          v-if="isClickable && selected.isVisible"
          :data="selected.data"
          :layout="layout"
          :scales="{ x:scaleX, y:scaleY }"
          :is-active="true"
          :color="color(selected.key)"
        />
      </transition>
      <x-selector
        v-if="hasSelector"
        :data="selectorData.data"
        :hasDots="hasSelectorDots"
        :dotData="selectorData.dotData"
      />
    </svg>
</template>

<script>
import {
  stackOffsetSilhouette as d3StackOffsetSilhouette,
  interpolateViridis as d3InterpolateViridis,
  stack as d3Stack
} from "d3";
import {
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3ScaleOrdinal
} from "d3-scale";

import PathArea from "../atoms/PathArea.vue";
import XAxis from "../atoms/XAxis";
import XSelector from "../atoms/XSelector";
import YAxis from "../atoms/YAxis";

export default {
  name: "StreamGraph",
  props: {
    origData: {
      type: Array,
      default: () => undefined
    },
    layout: {
      type: Object,
      default: () => {}
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
  data: function() {
    return {
      stackedData: null,
      selectorData: {
        data: [
                { x: this.layout.margin.left, y: this.layout.margin.top },
                { x: this.layout.margin.left, y: this.layout.height - this.layout.margin.bottom },
        ],
        dotData: [],
      },
      selected: {
        isVisible: false,
      },
    };
  },
  components: {
    PathArea,
    XAxis,
    XSelector,
    YAxis,
  },
  computed: {
    keys() {
      return this.origData.columns.slice(1);
    },
    xValues() {
      return this.origData.map(d => d.time);
    },
    xMin() {
      return Math.min(...this.xValues);
    },
    xMax() {
      return Math.max(...this.xValues);
    },
    yValues() {
      let yValues = [];
      if (this.stackedData != null) {
        Object.keys(this.stackedData).forEach(key => {
          this.stackedData[key].forEach(element => {
            yValues.push(element[0]);
            yValues.push(element[1]);
          });
        });
      }
      return yValues;
    },
    yMax() {
      return Math.max(...this.yValues);
    },
    yMin() {
      return Math.min(...this.yValues);
    },
    scaleX() {
      return d3ScaleLinear()
        .domain([this.xMin, this.xMax])
        .range([
          this.layout.margin.left,
          this.layout.width - this.layout.margin.right
        ]);
    },
    scaleY() {
      return d3ScaleLinear()
        .domain([this.yMin, this.yMax])
        .range([
          this.layout.height - this.layout.margin.bottom,
          this.layout.margin.top
        ]);
    },
    color() {
      // create a color for every key in a d3 color-sheme
      let colors = [];
      for (let i = 0; i <= this.keys.length; i++) {
        colors.push(d3InterpolateViridis(i / this.keys.length));
      }
      return d3ScaleOrdinal()
        .domain(this.keys)
        .range(colors);
    }
  },
  watch: {
    origData() {
      this.init();
    },
    stackOffset() {
      this.init();
    }
  },
  methods: {
    getStackedData() {
      let stackedData = d3Stack()
        .offset(this.stackOffset)
        .keys(this.keys)(this.origData);
      return stackedData;
    },
    init() {
      this.selected.isVisible = false;
      this.stackedData = this.getStackedData();
      this.$emit('initialized');
    },
    mouseMoved(event) {
      if(this.hasSelector) {
        let closestPoint = this.getClosestPoint(event.offsetX + 15);
        let closestPointData;
        this.origData.forEach(d => {
          if (d.time == closestPoint.time) closestPointData = d;
        });
        this.selectorData.dotData = [];
        if(this.hasSelectorDots) {
          this.selectorData.dotData = this.getStackedDataByYear(closestPointData.time);
        }
        this.updateSelector(closestPoint);
        this.$emit('mousemoved', closestPointData, event);
      }
    },
    updateSelector(closestPoint) {
      this.selectorData.data = [
        { x: closestPoint.x, y: this.layout.margin.top },
        { x: closestPoint.x, y: this.layout.height - this.layout.margin.bottom },
      ];
    },
    getClosestPoint(x) {
      let value = this.xValues
        .map(data => ({
          x: this.scaleX(data),
          diff: Math.abs(this.scaleX(data) - x),
          time: data
        }))
        .reduce((memo, val) => (memo.diff < val.diff ? memo : val));
      return value;
    },
    getStackedDataByYear(year) {
      year = year - this.stackedData[0][0].data.time;
      let values = [];
      for(let i = 0; i < this.stackedData.length; i++) {
        let key = this.stackedData[i].key;
        values.push({
          name: key,
          value: this.scaleY(this.stackedData[i][year][1]),
          color: this.color(key),
        });
      }
      return values;
    },
    pathAreaClicked(key, data) {
      if(this.isClickable) {
        this.selected = {
          isVisible: true,
          key: key,
          data: data,
        };
        this.$emit('clicked', key);
      }
    }
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 500ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.stream-graph {
  border: 2px solid #e2e2e7;
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-content: center;
}
</style>