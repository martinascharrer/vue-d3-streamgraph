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
          :x-key="xKey"
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
          :x-key="xKey"
          :layout="layout"
          :scales="{ x:scaleX, y:scaleY }"
          :is-active="true"
          :color="color(selected.key)"
        />
      </transition>
      <x-selector
        v-if="hasSelector && selector.isVisible"
        :data="selector.data"
        :hasDots="hasSelectorDots"
        :dotData="selector.dotData"
      />
    </svg>
</template>

<script>
import {
  stack as d3Stack
} from "d3";

import PathArea from "../atoms/PathArea.vue";
import XAxis from "../atoms/XAxis";
import XSelector from "../atoms/XSelector";
import YAxis from "../atoms/YAxis";

import { StreamGraphMixin } from '../mixins/StreamGraphMixin'

import { getLinearScale } from "../../utils/scales";

export default {
  name: "StreamGraph",
  data: function() {
    return {
      stackedData: null,
      selector: {
        isVisible: false,
        data: [],
        dotData: [],
      },
      currentClosestPoint: { x: this.layout.margin.left },
      selected: {
        isVisible: false,
      },
    };
  },
  mixins: [ StreamGraphMixin ],
  components: {
    PathArea,
    XAxis,
    XSelector,
    YAxis,
  },
  computed: {
    xValues() {
      return this.origData.map(d => d[this.xKey]);
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
      return getLinearScale(
              [ this.xMin, this.xMax ],
              [ this.layout.margin.left, this.layout.width - this.layout.margin.right]
      );
    },
    scaleY() {
      return getLinearScale(
              [this.yMin, this.yMax],
              [ this.layout.height - this.layout.margin.bottom, this.layout.margin.top]
      );
    },
  },
  watch: {
    origData() {
      this.selected.isVisible = false;
      this.selector.isVisible = false;
      this.stackedData =  this.getStackedData();
      this.$emit('initialized');
    },
    stackOffset() {
      this.init();
    },
    colorInterpolation() {
      this.updateSelector();
      this.$emit('colorchange', this.currentClosestPoint);
    },
  },
  methods: {
    getStackedData() {
      let stackedData = d3Stack()
        .offset(this.stackOffset)
        .keys(this.yKeys)(this.origData);
      return stackedData;
    },
    init() {
      this.selected.isVisible = false;
      this.selector.isVisible = false;
      this.stackedData = this.getStackedData();
      this.$emit('initialized');
    },
    mouseMoved(event) {
      if(this.hasSelector) {
        this.currentClosestPoint = this.getClosestPoint(event.offsetX + 15);
        let closestPointData;
        this.origData.forEach(d => {
          if (d[this.xKey] == this.currentClosestPoint[this.xKey]) closestPointData = d;
        });
        this.updateSelector();
        this.$emit('mousemoved', closestPointData, event);
      }
    },
    updateSelector() {
      this.selector.isVisible = true;
      this.selector.dotData = [];
      if(this.hasSelectorDots) {
        this.selector.dotData = this.getStackedDataAtXValue(this.currentClosestPoint[this.xKey]);
      }
      this.selector.data = [
        { x: this.currentClosestPoint.x, y: this.layout.margin.top },
        { x: this.currentClosestPoint.x, y: this.layout.height - this.layout.margin.bottom },
      ];
    },
    getClosestPoint(x) {
      let value = this.xValues
        .map(data => ({
          x: this.scaleX(data),
          diff: Math.abs(this.scaleX(data) - x),
          [this.xKey]: data
        }))
        .reduce((memo, val) => (memo.diff < val.diff ? memo : val));
      return value;
    },
    getStackedDataAtXValue(xValue) {
      // return if the data isn't properly laoded yet
      if (this.stackedData === null) return;

      // get the index of the given xValue by subtracting the xValue of the first entry
      let xIndex = xValue - this.stackedData[0][0].data[this.xKey];

      let values = [];
      for(let i = 0; i < this.stackedData.length; i++) {
        let key = this.stackedData[i].key;
        values.push({
          name: key,
          value: this.scaleY(this.stackedData[i][xIndex][1]),
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
  align-items: center;
  justify-content: center;
}
</style>