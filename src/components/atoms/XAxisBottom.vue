<template>
  <g ref="axis">
    <line :x1="layout.margin.left" :y1="height" :x2="width" :y2="height"></line>
    <g v-for="(tick) in ticks" :key="tick" :transform="`translate(${scale.x(tick)}, 0)`">
      <line :y1="height" :y2="height+10" stroke="black"></line>
      <text :style="`transform:translateY(${height+30}px)`">{{tick}}</text>
    </g>
  </g>
</template>

<script>
export default {
  name: "XAxisBottom",
  props: {
    scale: {
      type: Object,
      required: true
    },
    layout: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    height() {
      return this.layout.height - this.layout.margin.top;
    },
    width() {
      return this.layout.width - this.layout.margin.right;
    },
    ticks() {
      return this.scale.x.ticks();
    }
  }
};
</script>

<style scoped>
line {
  stroke: #666;
  stroke-width: 1px;
}
text {
  fill: #666;
  font-size: 0.6em;
  text-anchor: middle;
}
</style>