<template>
  <div class="stream-graph-infobox">
    <stream-graph-clickable
            :layout="layout"
            :origData="origData"
            :stackOffset="stackOffset"
            is-clickable="true"
            @clicked="activateSelected"
    />
    <div
      v-if="selected.isVisible"
      :style="`border: 3px solid ${selected.color}`"
      class="selectedContainer"
    >
      <h2>{{selected.name}}</h2>
      <p><em>highest:</em> {{selected.allTimeHigh}}</p>
      <p><em>lowest:</em> {{selected.allTimeLow}}</p>
      <p><em>average:</em> {{selected.average}}</p>
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
      let sum = 0;
      for (let i = 0; i < selectedData.length; i++){
        sum += +selectedData[i];
      }
      console.log(sum);
      this.selected = {
        isVisible: true,
        name: key,
        allTimeHigh: Math.floor(Math.max(...selectedData) * 100) / 100,
        allTimeLow: Math.floor(Math.min(...selectedData) * 100) / 100,
        average: Math.round(sum / selectedData.length),
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
.stream-graph-infobox {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.selectedContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 15vw;
  height: auto;
  transition: border 1000ms;
  margin-left: 1em;
}

em {
  font-weight: bold;
  font-style: normal;
}
</style>