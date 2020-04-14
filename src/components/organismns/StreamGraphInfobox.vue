<template>
  <div class="stream-graph-infobox">
    <stream-graph-clickable
            :layout="layout"
            :origData="origData"
            :stackOffset="stackOffset"
            :is-clickable="true"
            :color-interpolation="colorInterpolation"
            :color-array="colorArray"
            @clicked="activateSelected"
            @initialized="resetInfobox"
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
import StreamGraph from "../molecules/StreamGraph";
import {StreamGraphMixin} from "../mixins/StreamGraphMixin";

export default {
  name: "StreamGraphInfobox",
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
  mixins: [ StreamGraphMixin ],
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
      this.selected = {
        isVisible: true,
        name: key,
        allTimeHigh: Math.floor(Math.max(...selectedData) * 100) / 100,
        allTimeLow: Math.floor(Math.min(...selectedData) * 100) / 100,
        average: Math.round(sum / selectedData.length),
        color: this.color(key),
      };
    },
    resetInfobox() {
      this.selected = {
        isVisible: false,
      }
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

<style>
.stream-graph-infobox {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.stream-graph-infobox .path-area:hover {
  opacity: 0.9;
  transition: opacity 200ms;
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