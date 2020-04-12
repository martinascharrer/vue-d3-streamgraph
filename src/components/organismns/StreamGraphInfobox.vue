<template>
  <div class="stream-graph">
    <stream-graph-clickable
            :layout="layout"
            :origData="origData"
            :stackOffset="stackOffset"
            is-clickable="true"
            @clicked="activateSelected"
    />
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
</template>

<script>
import {
  stackOffsetSilhouette as d3StackOffsetSilhouette,
  interpolateViridis as d3InterpolateViridis,
} from "d3";
import {
  scaleOrdinal as d3ScaleOrdinal
} from "d3-scale";

import StreamGraph from "../molecules/StreamGraph";

export default {
  name: "StreamGraphInfobox",
  props: {
    origData: {
      type: Array,
      default: () => undefined,
    },
    stackOffset: {
      default: d3StackOffsetSilhouette,
    },
    layout: {
      type: Object,
      default: () => {},
    },
    colorScheme: {
      default: d3InterpolateViridis,
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
    StreamGraphClickable: StreamGraph
  },
  computed: {
    keys() {
      return this.origData.columns.slice(1);
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
  },
  methods: {
    activateSelected(key) {
      let selectedData = this.getDataByKey(key);
      this.selected = {
        isVisible: true,
        name: key,
        allTimeHigh: Math.floor(Math.max(...selectedData) * 100) / 100,
        allTimeLow: Math.floor(Math.min(...selectedData) * 100) / 100,
        color: this.color(key),
      };
    },
    getDataByKey(key) {
      let data = [];
      this.origData.forEach(element => {
        data.push(element[key]);
      });
      return data;
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

.stream-graph {
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