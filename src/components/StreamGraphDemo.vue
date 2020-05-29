<template>
    <div id="demoContainer">
        <nav>
            <h3>Props & data</h3>
            <p>Play around with different settings, data-sets and interactivity options.</p>
            <label for="selectInteractivity">Interactivity</label>
            <select id="selectInteractivity" v-model="interactivity">
                <option v-for="option in interactivityOptions" :value="option" :key="option">{{ option }}</option>
            </select>

            <label for="selectStackOffset">StackOffset</label>
            <select id="selectStackOffset" v-model="stackOffset">
                <option v-for="option in stackOffsetOptions" :value="option.value" :key="option.text">{{ option.text }}</option>
            </select>

            <label for="selectData">Data</label>
            <select id="selectData" v-model="csvPath">
                <option
                        v-for="option in dataOptions"
                        :value="option.value"
                        :key="option.text"
                >{{ option.text }}
                </option>
            </select>

            <label for="colorInterpolation">color</label>
            <select id="colorInterpolation" v-model="colorInterpolation">
                <option
                        v-for="option in colorInterpolationOptions"
                        :value="option.value"
                        :key="option.text"
                >{{ option.text }}
                </option>
            </select>
        </nav>

        <div v-if="interactivity === 'simple'" class="graph">
            <h2>Simple streamgraph</h2>
            <stream-graph
                :origData="origData"
                :layout="layout"
                :stackOffset="stackOffset"
                :x-axis-long="true"
                :has-y-axis="true"
                :color-interpolation="colorInterpolation"
                :color-array="colorArray"
            />
        </div>

        <div v-else-if="interactivity === 'tooltip'" class="graph">
            <h2>Streamgraph with tooltip</h2>
            <p>Hover over the graph for more information.</p>
            <StreamGraphToolTip
                    :layout="layout"
                    :stackOffset="stackOffset"
                    :origData="origData"
                    :color-interpolation="colorInterpolation"
            />
        </div>

        <div v-else-if="interactivity === 'infobox'" class="graph">
            <h2>Streamgraph with infobox</h2>
            <p>Select one of the </p>
            <StreamGraphInfobox
                    :layout="layout"
                    :stackOffset="stackOffset"
                    :origData="origData"
                    :color-array="colorArray"
            />
        </div>

        <div v-else class="graph">
            <h2>Streamgraph with bar chart</h2>
            <p>Hover over the graph for more information.</p>
            <StreamGraphBarChart
                    :origData="origData"
                    :layout="layout"
                    :stackOffset="stackOffset"
                    :color-interpolation="colorInterpolation"
            />
        </div>
    </div>
</template>

<script>
import {
    csv as d3Csv,
    interpolateViridis as d3interpolateViridis,
    interpolateSpectral as d3InterpolateSpectral,
    interpolateInferno as d3InterpolateInferno,
    interpolateCubehelixDefault as d3interpolateCubehelixDefault,
    schemeTableau10 as d3schemeRdBu,
    stackOffsetSilhouette,
    stackOffsetExpand,
    stackOffsetNone,
} from "d3";

import StreamGraph from "./molecules/StreamGraph";
import StreamGraphBarChart from "./organismns/StreamGraphBarChart";
import StreamGraphInfobox from "./organismns/StreamGraphInfobox";
import StreamGraphToolTip from "./organismns/StreamGraphToolTip";

export default {
    name: "StreamGraphDemo",
    components: {
        StreamGraph,
        StreamGraphBarChart,
        StreamGraphInfobox,
        StreamGraphToolTip,
    },
    data() {
        return {
            origData: [],
            layout: {
                width: 800,
                height: 400,
                margin: {top: 40, bottom: 70, left: 60, right: 40},
            },
            colorInterpolation: d3interpolateViridis,
            colorInterpolationOptions: [
                { text: "viridis", value: d3interpolateViridis },
                { text: "inferno", value: d3InterpolateInferno },
                { text: "spectral", value: d3InterpolateSpectral },
                { text: "cubehelix", value: d3interpolateCubehelixDefault },
            ],
            colorArray: d3schemeRdBu,
            interactivity: "barchart",
            interactivityOptions: [ "simple", "infobox", "tooltip", "barchart" ],
            stackOffset: stackOffsetNone,
            stackOffsetOptions: [
                {text: "Silhouette", value: stackOffsetSilhouette},
                {text: "Baseline", value: stackOffsetNone},
                {text: "Expand", value: stackOffsetExpand}
            ],
            csvPath: "/data/office.csv",
            dataOptions: [
                {text: "office", value: "/data/office.csv"},
                {text: "insurance", value: "/data/insurance.csv"},
            ],
        };
    },
    methods: {
        async loadCSV() {
            await d3Csv(this.csvPath).then(data => {
                this.origData = data;
            });
        },
    },
    watch: {
        csvPath() {
            this.loadCSV();
        },
        interactivity() {
            this.loadCSV();
        },
    },
    mounted () {
        this.loadCSV();
    },
}
</script>

<style scoped>

#demoContainer{
    display: flex;
}

nav {
    width: 15vw;
    height: 100vh;
    border-right: 2px solid #e2e2e7;
    display: flex;
    flex-direction: column;
    text-align: left;
    background: white;
    margin-right: 2em;
    padding: 2em;
    font-size: 1em;
}

label {
    font-size: 0.9em;
    margin-top: 1em;
}

select {
    padding: 0.5em 1em;
    margin-top: 0.5em;
    font-size: 1em;
}

.graph {
    padding: 2em;
}
</style>