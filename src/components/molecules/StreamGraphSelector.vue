<template>
  <div class="vue-stream-graph">
    <svg
      :width="layout.width"
      :height="layout.height"
      @mousemove="mouseMoved"
      @mouseleave="$emit('mouseLeft')"
    >
      <transition-group tag="g" name="fade">
        <path-area
          v-for="d in stackedData"
          :key="d.key"
          :data="d"
          :layout="layout"
          :scales="{x:scaleX, y:scaleY}"
          :color="color(d.key)"
        />
      </transition-group>
      <x-selector :data="selectorData" />
      <axes-left-bottom :scale="{x:scaleX, y:scaleY}" :layout="layout" />
    </svg>
  </div>
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
import AxesLeftBottom from "../molecules/AxesLeftBottom.vue";
import XSelector from "../atoms/XSelector";

export default {
  name: "StreamGraph",
  props: {
    origData: {
      type: Array,
      default: () => undefined
    },
    stackOffset: {
      default: d3StackOffsetSilhouette
    },
    layout: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      stackedData: null,
      selectorData: [
        { x: this.layout.margin.left, y: this.layout.margin.top },
        {
          x: this.layout.margin.left,
          y: this.layout.height - this.layout.margin.bottom
        }
      ]
    };
  },
  components: {
    PathArea,
    AxesLeftBottom,
    XSelector
  },
  computed: {
    keys() {
      return this.origData.columns.slice(1);
    },
    graphHeight() {
      return (
        this.layout.height - this.layout.margin.top - this.layout.margin.bottom
      );
    },
    graphWidth() {
      return (
        this.layout.width - this.layout.margin.left - this.layout.margin.right
      );
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
      this.stackedData = this.getStackedData();
    },
    stackOffset() {
      this.stackedData = this.getStackedData();
    }
  },
  methods: {
    getStackedData() {
      //stack the data
      let stackedData = d3Stack()
        .offset(this.stackOffset)
        .keys(this.keys)(this.origData);

      return stackedData;
    },
    mouseMoved(event) {
      // find the closestPoint
      let closestPoint = this.getClosestPoint(event.offsetX + 15);

      let closestPointData;
      this.origData.forEach(d => {
        if (d.time == closestPoint.time) {
          closestPointData = d;
        }
      });

      this.updateSelector(closestPoint);
      this.$emit('mousemoved', closestPointData, event);
    },
    updateSelector(closestPoint) {
      this.selectorData = [
        { x: closestPoint.x, y: this.layout.margin.top },
        {
          x: closestPoint.x,
          y: this.layout.height - this.layout.margin.bottom
        }
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
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.vue-stream-graph {
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-content: center;
}

.selectedContainer {
  display: flex;
  flex-direction: column;
  width: 10vw;
  transition: all 1000ms;
}
</style>