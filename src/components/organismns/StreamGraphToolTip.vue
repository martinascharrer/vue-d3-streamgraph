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
    <stream-graph-selector
            :layout="layout"
            :origData="origData"
            :stackOffset="stackOffset"
            @mousemoved="updateInfoBox"
            @mouseleft="DeactivateInfobox"
    />
  </div>
</template>

<script>
import {
  stackOffsetSilhouette as d3StackOffsetSilhouette,
  interpolateViridis as d3InterpolateViridis
} from "d3";
import { scaleOrdinal as d3ScaleOrdinal } from "d3-scale";
import InfoBox from "../atoms/ToolTip.vue";
import StreamGraphSelector from "../molecules/StreamGraphSelector";


export default {
  name: "StreamGraphToolTip",
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
    };
  },
  components: {
    InfoBox,
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
    DeactivateInfobox() {
      this.infobox.isVisible = false;
    },
    updateInfoBox(data, event) {
      // update the infobox
      let columns = this.origData.columns;
      let total = 0;
      let entries = [];
      for (let i = 1; i < columns.length; i++) {
        total += +data[columns[i]]; // calc total, + to convert from string to number
        // push the list-entries
        entries.push({
          label: columns[i],
          value: data[columns[i]],
          color: this.color(columns[i])
        });
      }
      this.infobox = {
        title: data.time,
        text: "Total: " + total,
        entries: entries,
        x: event.pageX + 30,
        y: event.pageY + 30,
        isVisible: true,
      }
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