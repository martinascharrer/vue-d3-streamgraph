<template>
  <div class="stream-graph-bar-chart">
    <StreamGraphSelector
            class="stream-graph-bar-chart__item"
            :layout="layout"
            :orig-data="origData"
            :stack-offset="stackOffset"
            @mousemoved="updateBarChartData"
    />
    <bar-chart
            class="stream-graph-bar-chart__item"
            :data="barChartData.entries"
            :title="barChartData.title"
            :layout="barChartData.layout"
            :bar-width="10"
            :extremes="{ min: 0, max: 50000 }"
            :nr-of-axis="4"
    />
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

import BarChart from "../atoms/BarChart";
import StreamGraphSelector from "../molecules/StreamGraphSelector";

export default {
  name: "StreamGraphBarChart",
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
      searchedYear: 0,
      barChartData: {
        title: "",
        entries: [],
        layout: {
          width: 300,
          height: 200,
          margin: {top: 100, bottom: 100, left: 30, right: 20}
        },
      },
    };
  },
  components: {
    BarChart,
    StreamGraphSelector,
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
  methods: {
    updateBarChartData(data) {
      this.barChartData.entries = [];
      let columns = this.origData.columns;
      for (let i = 1; i < columns.length; i++) {
        this.barChartData.entries.push({
          label: columns[i],
          value: data[columns[i]],
          color: this.color(columns[i])
        });
      }
      this.barChartData.title = "Year: " + data.time;
    },
    searchData() {
      let data = this.getDataByYear(this.searchedYear);
      this.updateBarChartData(data);
      // update/grey selector?
    },
    getDataByYear(year) {
      let data = [];
      this.origData.forEach(element => {
        if(element.time == year) data = element;
      });
      return data;
    },
  }
};
</script>

<style scoped>
.stream-graph-bar-chart {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.stream-graph-bar-chart__item {
  margin: 1em;
}
</style>