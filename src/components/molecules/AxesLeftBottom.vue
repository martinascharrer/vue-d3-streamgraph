<template>
  <g id="AxisContainer">
    <x-axis-bottom :scale="scale" :layout="layout" />
    <y-axis-left :scale="scale" :width="layout.margin.left" />
  </g>
</template>

<script>
import XAxisBottom from "../atoms/XAxisBottom.vue";
import YAxisLeft from "../atoms/YAxisLeft.vue";
export default {
  name: "AxesLeftBottom",
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
  components: {
    XAxisBottom,
    YAxisLeft
  }
};
</script>
