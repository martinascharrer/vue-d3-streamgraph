<template>
  <div class="stream-graph-bar-chart">
    <StreamGraph
            class="stream-graph-bar-chart__item"
            :layout="layout"
            :orig-data="origData"
            :stack-offset="stackOffset"
            :hasSelector="true"
            :has-selector-dots="true"
            :y-axis-long="true"
            :x-axis-long="true"
            :x-axis-has-end-line="true"
            :color-interpolation="colorInterpolation"
            :color-array="colorArray"
            @mousemoved="updateBarChartData"
            @initialized="resetBarChart"
            @colorchange="resetColors"
    />
    <bar-chart
            class="stream-graph-bar-chart__item"
            :data="barChart.entries"
            :title="barChart.title"
            :layout="barChart.layout"
            :bar-width="10"
            :max="barChart.max"
            :nr-of-ticks="7"
    />
  </div>
</template>

<script>
import BarChart from "../atoms/BarChart";
import StreamGraph from "../molecules/StreamGraph";

import {StreamGraphMixin} from "../mixins/StreamGraphMixin";

export default {
  name: "StreamGraphBarChart",
  data: function() {
    return {
      searchedYear: 0,
      barChart: {
        title: "",
        entries: [],
        layout: {
          width: 400,
          height: 250,
          margin: { top: 20, bottom: 40, left: 40, right: 40 }
        },
      },
    };
  },
  components: {
    BarChart,
    StreamGraph,
  },
  mixins: [ StreamGraphMixin ],
  computed: {
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
    resetBarChart() {
      this.barChart = {
        title: "",
                entries: [],
                layout: {
          width: 400,
                  height: 250,
                  margin: { top: 20, bottom: 40, left: 40, right: 40 }
        },
      };
    },
    resetColors() {
      for (let i = 0; i < this.barChart.entries.length; i++) {
        this.barChart.entries[i].color = this.color(this.barChart.entries[i].label);
      }
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
</style>