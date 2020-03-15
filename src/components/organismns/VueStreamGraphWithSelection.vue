<template>
  <div class="vue-stream-graph">
    <info-box
      v-if="infobox.isVisible"
      :x="infobox.x"
      :y="infobox.y"
      :title="infobox.title"
      :text="infobox.text"
      :entries="infobox.entries"
    />
    <svg
      :width="layout.width"
      :height="layout.height"
      @mousemove="ActivateInfobox"
      @mouseleave="DeactivateInfobox"
    >
      <transition-group tag="g" name="fade">
        <path-area
          v-for="(d, key) in stackedData"
          :key="key"
          :data="d"
          :layout="layout"
          :scales="{x:scaleX, y:scaleY}"
          :color="color(key)"
          @clicked="activateSelected(key)"
          :isActive="selected.name == key"
        />
      </transition-group>
      <x-selector :data="selectorData" />
      <axes-left-bottom :scale="{x:scaleX, y:scaleY}" :layout="layout" />
    </svg>
    <div>
      <h2>{{infobox.title}}</h2>
      <div
        v-if="selected.isVisible"
        :style="{border: `3px solid ${selected.color}`}"
        class="selectedContainer"
      >
        <h3>{{selected.name}}</h3>
        <p>highest: {{selected.allTimeHigh}}</p>
        <p>lowest: {{selected.allTimeLow}}</p>
      </div>
      <p v-else class="selectedContainer">
        <em>Select one of the areas for more information.</em>
      </p>
    </div>
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
import PathArea from "./atoms/PathAreaClickable.vue";
import InfoBox from "./atoms/InfoBox.vue";
import AxesLeftBottom from "./molecules/AxesLeftBottom.vue";
import XSelector from "./atoms/XSelector";

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
      infobox: {
        title: "title",
        x: 0,
        y: 0,
        isVisible: false,
        entries: null
      },
      selectorData: [
        { x: this.layout.margin.left, y: this.layout.margin.top },
        {
          x: this.layout.margin.left,
          y: this.layout.height - this.layout.margin.bottom
        }
      ],
      selected: {
        isVisible: false,
        name: "",
        allTimeHigh: 10,
        allTimeLow: 0,
        color: "#222"
      }
    };
  },
  components: {
    PathArea,
    InfoBox,
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
      return this.origData.map(d => d.year);
    },
    xMin() {
      return Math.min(...this.xValues);
    },
    xMax() {
      return Math.max(...this.xValues);
    },
    yValues() {
      let yValues = [];
      Object.keys(this.stackedData).forEach(key => {
        this.stackedData[key].forEach(element => {
          yValues.push(element.y0);
          yValues.push(element.y1);
        });
      });
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
      this.init();
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

      // reorder data for the path-area component
      let orderedData = {};
      stackedData.forEach(element => {
        let personData = [];
        element.forEach(d => {
          personData.push({ x: d.data.year, y0: d[0], y1: d[1] });
        });
        orderedData[element.key] = personData;
      });

      return orderedData;
    },
    DeactivateInfobox() {
      this.infobox.isVisible = false;
    },
    ActivateInfobox(event) {
      // find the closestPoint
      let closestPoint = this.getClosestPoint(event.offsetX + 15);

      // get the data of the closest point
      let data;
      this.origData.forEach(d => {
        if (d.year == closestPoint.year) {
          data = d;
        }
      });

      this.updateSelector(closestPoint);
      this.updateInfoBox(data, event);
    },
    activateSelected(key) {
      let diffValues = [];
      let data = this.stackedData[key];
      data.forEach(element => {
        diffValues.push(element.y1 - element.y0);
      });
      this.selected.isVisible = true;
      this.selected.allTimeHigh = Math.max(...diffValues);
      this.selected.allTimeLow = Math.min(...diffValues);
      this.selected.name = key;
      this.selected.color = this.color(key);
    },
    updateInfoBox(data, event) {
      // update the infobox
      this.infobox.entries = [];
      let columns = this.origData.columns;
      let total = 0;
      for (let i = 1; i < columns.length; i++) {
        total += +data[columns[i]]; // calc total, + to convert from string to number
        // push the list-entries
        this.infobox.entries.push({
          label: columns[i],
          value: data[columns[i]],
          color: this.color(columns[i])
        });
      }
      this.infobox.text = "Total: " + total;
      this.infobox.title = data.year;
      this.infobox.x = event.clientX;
      this.infobox.y = event.offsetY;
      this.infobox.isVisible = true;
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
          year: data
        }))
        .reduce((memo, val) => (memo.diff < val.diff ? memo : val));
      return value;
    },
    init() {
      this.selected.isVisible = false;
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