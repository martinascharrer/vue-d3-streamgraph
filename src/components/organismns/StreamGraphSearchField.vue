<template>
  <div class="stream-graph-search-field">
    <StreamGraph
            class="stream-graph-bar-chart__item"
            :layout="layout"
            :orig-data="origData"
            :stack-offset="stackOffset"
            :color-interpolation="colorInterpolation"
    />
    <div class="infobox">
      <input type="number" v-model="searchedYear" @change="searchData"/>
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
import StreamGraph from "../molecules/StreamGraph";

import {StreamGraphMixin} from "../mixins/StreamGraphMixin";

export default {
  name: "StreamGraphSearchField",
  props: {
    origData: {
      type: Array,
      default: () => undefined
    },
    stackOffset: {
      type: Function,
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
  mixins: [ StreamGraphMixin ],
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
  .stream-graph-search-field {
    display: flex;
    justify-content: center;
  }

  .infobox {
    width: 15vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 2em;
    background: white;
    border: 2px solid #e2e2e7;
    padding: 1em;
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