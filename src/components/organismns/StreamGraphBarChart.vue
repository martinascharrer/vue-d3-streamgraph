<template>
  <div class="stream-graph-bar-chart">
    <StreamGraph
            class="stream-graph-bar-chart__item"
            :layout="layout"
            :orig-data="origData"
            :stack-offset="stackOffset"
            :hasSelector="true"
            :has-selector-dots="true"
            @mousemoved="updateBarChartData"
    />
    <bar-chart
            class="stream-graph-bar-chart__item"
            :data="barChart.entries"
            :title="barChart.title"
            :layout="barChart.layout"
            :bar-width="10"
            :max="barChart.max"
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
import StreamGraph from "../molecules/StreamGraph";

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
      barChart: {
        title: "",
        entries: [],
        layout: {
          width: 300,
          height: 200,
          margin: { top: 20, bottom: 20, left: 40, right: 20 }
        },
        max: 100,
      },
    };
  },
  components: {
    BarChart,
    StreamGraph,
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
    },
    origDataValues() {
      let values = [];
      for (let i = 0; i < this.origData.length; i++) {
        for (let j = 0; j < this.keys.length; j++) {
          let key = this.keys[j];
          values.push(this.origData[i][key]);
        }
      }
      return values;
    }
  },
  methods: {
    updateBarChartData(data) {
      this.barChart.entries = [];
      let columns = this.origData.columns;
      for (let i = 1; i < columns.length; i++) {
        this.barChart.entries.push({
          label: columns[i],
          value: data[columns[i]],
          color: this.color(columns[i])
        });
      }
      this.barChart.title = "Year: " + data.time;
      this.barChart.max = Math.max(...this.origDataValues);
    },
    searchData() {
      let data = this.getDataByYear(this.searchedYear);
      this.updateBarChartData(data);
      // TODO: update selector
    },
    getDataByYear(year) {
      let data = [];
      this.origData.forEach(element => {
        if(element.time == year) data = element;
      });
      return data;
    },
  },
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