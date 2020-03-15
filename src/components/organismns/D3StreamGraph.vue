<template>
  <div class="graph-container" ref="container">
    <svg class="d3StreamGraph" ref="svg" :width="layout.width" :height="layout.height" />
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "d3StreamGraph",
  props: {
    origData: {
      type: Array,
      default: () => undefined
    },
    stackOffset: {
      default: d3.stackOffsetSilhouette
    },
    layout: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      stackedData: null
    };
  },
  computed: {
    graphHeight() {
      return (
        this.layout.height - this.layout.margin.top - this.layout.margin.bottom
      );
    },
    graphWidth() {
      return (
        this.layout.width - this.layout.margin.left - this.layout.margin.right
      );
    },
    xValues() {
      return this.origData.map(d => d.year);
    },
    xMin() {
      return Math.min(...this.xValues);
    },
    xMax() {
      return Math.max(...this.xValues);
    },
    yValues() {
      let yValues = [];
      Object.keys(this.stackedData).forEach(key => {
        this.stackedData[key].forEach(element => {
          yValues.push(element[0]);
          yValues.push(element[1]);
        });
      });
      return yValues;
    },
    yMax() {
      return Math.max(...this.yValues);
    },
    yMin() {
      return Math.min(...this.yValues);
    },
    x() {
      return d3
        .scaleLinear()
        .domain([this.xMin, this.xMax])
        .range([
          this.layout.margin.left,
          this.layout.width - this.layout.margin.right
        ]);
    },
    y() {
      return d3
        .scaleLinear()
        .domain([this.yMin, this.yMax])
        .range([
          this.layout.height - this.layout.margin.bottom,
          this.layout.margin.top
        ]);
    },
    keys() {
      return this.origData.columns.slice(1);
    },
    color() {
      // create a color for every key in a d3 color-sheme
      let colors = [];
      for (let i = 0; i <= this.keys.length; i++) {
        colors.push(d3.interpolateMagma(i / this.keys.length));
      }
      return d3
        .scaleOrdinal()
        .domain(this.keys)
        .range(colors);
    }
  },
  methods: {
    getStackedData() {      
      let stackedData = d3
        .stack()
        .offset(this.stackOffset)
        .keys(this.keys)(this.origData);
               
      return stackedData;
    },
    updateInfoBox(data, event) {
      let text = "<h2>" + data.year + "</h2>";
      let list = "<ul>";
      let columns = this.origData.columns;
      let total = 0;
      for (let i = 1; i < columns.length; i++) {
        total += +data[columns[i]]; // calc total, + to convert from string to number
        list +=
          "<li><span style='background:" +
          this.color(columns[i]) +
          "'></span> " +
          columns[i] +
          ": " +
          data[columns[i]] +
          "</li>";
      }
      list += "</ul>";
      text += "<p>Total: " + total + "</p>";
      text += list;

      this.infobox
        .html(text)
        .style("opacity", 1)
        .style("left", event.pageX + 30 + "px")
        .style("top", event.pageY - 28 + "px");
    },
    drawGraph() {
      let that = this;

      // join data
      this.paths = this.areaContainer.selectAll(".area").data(this.stackedData);

      // enter
      this.paths
        .enter()
        .append("path")
        .style("fill", function(d) {
          return that.color(d.key);
        })
        .attr("class", "area")
        .attr(
          "d",
          d3
            .area()
            .x(d => {
              return that.x(d.data.year);
            })
            .y0(function(d) {
              return that.y(d[0]);
            })
            .y1(function(d) {
              return that.y(d[1]);
            })
        );

      // update
      this.paths
        .transition()
        .duration(400)
        .attr(
          "d",
          d3
            .area()
            .x(function(d) {
              return that.x(d.data.year);
            })
            .y0(function(d) {
              return that.y(d[0]);
            })
            .y1(function(d) {
              return that.y(d[1]);
            })
        );

      // exit
      this.paths.exit().remove();

      // interaction on mousemove over svg
      this.svg
        .on("mousemove", function() {
          // find the closestPoint
          let closestPoint = that.getClosestPoint(event.offsetX + 10);

          // get the data of the closest point
          let data;
          that.origData.forEach(d => {
            if (d.year == that.xValues[closestPoint.index]) {
              data = d;
            }
          });

          // update infobox and selector
          that.updateInfoBox(data, d3.event);
          that.selector.attr("x", closestPoint.x);
        })
        .on("mouseleave", function() {
          that.infobox.style("opacity", 0);
        });

      // update axis      
      this.xAxis.call(d3.axisBottom(this.x));
      this.yAxis.call(d3.axisLeft(this.y));
    },
    initAxis() {
      // Add X axis
      this.xAxis = this.svg
        .append("g")
        .attr(
          "transform",
          "translate(" +
            0 +
            "," +
            (this.graphHeight + this.layout.margin.top) +
            ")"
        );        

      // Add Y axis
      this.yAxis = this.svg
        .append("g")
        .attr("text-anchor", "end")
        .attr(
          "transform",
          "translate(" + this.layout.margin.left + "," + 0 + ")"
        );
    },
    getClosestPoint(x) {
      let value = this.xValues
        .map((data, index) => ({
          x: this.x(data),
          diff: Math.abs(this.x(data) - x),
          index
        }))
        .reduce((memo, val) => (memo.diff < val.diff ? memo : val));
      return value;
    }
  },
  watch: {
    origData() {
      this.stackedData = this.getStackedData();
    },
    stackOffset() {
      this.stackedData = this.getStackedData();
    },
    stackedData() {      
        this.drawGraph();      
    }
  },
  mounted() {
    // select the svg
    this.svg = d3.select(this.$refs["svg"]);

    // Define the div for the infobox
    this.infobox = d3
      .select(this.$refs["container"])
      .append("div")
      .attr("class", "infobox")
      .style("opacity", 0);

    // create the area-container
    this.areaContainer = this.svg.append("g").attr("class", "area-container");

    this.selector = this.svg
      .append("rect")
      .attr("class", "selector")
      .attr("x", this.layout.margin.left)
      .attr("y", this.layout.margin.top)
      .attr("width", "3px")
      .attr("height", this.graphHeight)
      .attr("fill", "crimson");

    this.initAxis();
  }
};
</script>

<style>
.infobox {
  position: absolute;
  text-align: left;
  padding: 2px;
  font: 12px sans-serif;
  background: white;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
}

.infobox h2,
.infobox p {
  text-align: center;
}

ul {
  padding: 1em 1em;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: left;
}

ul li {
  list-style: none;
}

ul span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 1em;
  margin: 0 0.5em;
}

path {
  transition: opacity 300ms;
}

path:hover {
  opacity: 0.85;
}
</style>