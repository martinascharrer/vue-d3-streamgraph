<template>
  <div class="stream-graph">
    <StreamGraph
            class="stream-graph-bar-chart__item"
            :layout="layout"
            :orig-data="origData"
            :stack-offset="stackOffset"
    />
    <div class="infobox">
      <h3><input type="number" v-model="searchedYear" @change="searchData"/></h3>
      <p>{{ infobox.text }}</p>
      <ul v-if="infobox.entries != null" class="list">
        <li v-for="entry in infobox.entries" :key="entry.label">
        <span
                class="circle"
                v-if="entry.color != null"
                :style="{
        background: `${entry.color}`}"
        ></span>
          <em>{{entry.label}}</em>
          {{": " + entry.value}}
        </li>
      </ul>
    </div>
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
  name: "StreamGraphSearchField",
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
      searchedYear: 1880,
      infobox: {
        x: 0,
        y: 0,
        isVisible: false,
        entries: null
      },
    };
  },
  components: {
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
    }
  },
  methods: {
    updateInfobox(data) {
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
        isVisible: true,
      }
    },
    searchData() {
      let data = this.getDataByYear(this.searchedYear);
      this.updateInfobox(data);
      // update/grey selector?
    },
    getDataByYear(year) {
      let data = [];
      this.origData.forEach(element => {
        if(element.time == year) data = element;
      });
      return data;
    },
  },
  watch: {
    origData() {
      this.searchData();
    }
  },
};
</script>

<style scoped>
  .infobox {
    width: 15vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 1em;
    -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
  }

  .list {
    padding: 0;
  }

  li {
    list-style: none;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .circle {
    width: 10px;
    height: 10px;
    border-radius: 1em;
    margin: 0 0.5em;
  }

  em {
    font-style: normal;
    font-weight: bold;
  }
</style>