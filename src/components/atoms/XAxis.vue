<template>
  <g>
    <line v-if="!vertical && hasLines" :x1="layout.margin.left" :y1="height" :x2="width" :y2="height"/>
    <g v-for="(tick) in ticks" :key="tick" :transform="`translate(${scale.x(tick)}, 0)`">
      <line v-if="vertical && hasLines" :y1="layout.margin.top" :y2="height"/>
      <line v-else-if="hasLines" :y1="height" :y2="height+tickWidth"/>
      <text :style="`transform:translateY(${height+tickWidth + 5}px)`">{{ tick }}</text>
    </g>
    <line v-if="hasEndLine" :transform="`translate(${scale.x(scale.x.domain()[1])}, 0)`" :y1="layout.margin.top" :y2="height"/>
  </g>
</template>

<script>
export default {
  name: "XAxis",
  props: {
    scale: {
      type: Object,
      required: true
    },
    layout: {
      type: Object,
      default: () => {}
    },
    tickWidth: {
      type: Number,
      default: 10,
    },
    nrOfTicks: {
      type: Number,
      default: 10,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    hasLines: {
      type: Boolean,
      default: true,
    },
    hasEndLine: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    height() {
      return this.layout.height - this.layout.margin.bottom;
    },
    width() {
      return this.layout.width - this.layout.margin.right;
    },
    ticks() {
      return this.scale.x.ticks(this.nrOfTicks);
    }
  }
};
</script>

<style scoped>
line {
  stroke: #cccccc;
  stroke-width: 1px;
}
text {
  fill: #888888;
  font-size: 0.8em;
  text-anchor: middle;
  alignment-baseline: hanging;
}
</style>