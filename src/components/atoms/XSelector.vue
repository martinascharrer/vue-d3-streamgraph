<template>
  <g>
    <path class="selector" :d="d"></path>
  </g>
</template>

<script>
import { line as d3Line } from "d3";

export default {
  name: "XSelector",
  props: {
    data: {
      type: Array
    }
  },
  computed: {
    d() {
      return this.createLine(this.data);
    }
  },
  methods: {
    createLine: d3Line()
      .x(d => d.x)
      .y(d => d.y)
  }
};
</script>

<style scoped>
path {
  stroke: crimson;
  stroke-width: 3px;
}
</style>