<template>
  <path :d="d" :fill="color" @click="$emit('clicked')" :class="{active : isActive, 'path-area' : true}"></path>
</template>

<script>
import { area as d3Area } from "d3";
export default {
  name: "PathArea",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    scales: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default: () => "#000000"
    },
    isActive:{
      type:Boolean,
      required:false,
      default: false
    }
  },
  computed: {
    d() {
      let scales = this.scales;
      let area = d3Area()
        .x(function(d) {
          return scales.x(d.data.time);
        })
        .y0(function(d) {
          return scales.y(d[0]);
        })
        .y1(function(d) {
          return scales.y(d[1]);
        });
        return area(this.data);
    }    
  }
};
</script>

<style scoped>
.path-area {
  transition: d 200ms ease;
}

.active {
  stroke:#222;
  stroke-width: 2px;
}
</style>