<template>
  <g ref="axis">
    <line
      :x1="width"
      :y1="scale.y(ticks[0])"
      :x2="width"
      :y2="scale.y(ticks[ticks.length-1])"
      stroke="black"
    ></line>

    <g v-for="(tick) in ticks" :key="tick" :transform="`translate(0, ${scale.y(tick)})`">
      <line :x1="width-10" :x2="width" stroke="black"></line>
      <text alignment-baseline="middle" :style="`transform:translateX(${width-15}px)`">{{tick}}</text>
    </g>
  </g>
</template>

<script>
export default {
  name: "YAxisLeft",
  props: {
    scale: {
      type: Object,
      required: true
    },
    width:{
      type: Number,
      required:true
    }
  },  
  computed: {
    ticks() {   
      return this.scale.y.ticks();
    }    
  },
  methods: {}
};
</script>

<style scoped>
line {
  stroke: #666;
  stroke-width:1px;
}
text {
  fill: #666;
  font-size: 0.6em;
  text-anchor: end;
}
</style>