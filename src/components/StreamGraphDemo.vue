<template>
    <div>
        <nav>
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
        </nav>

        <div v-if="interactivity === 'simple'">
            <h2>Simple streamgraph</h2>
            <stream-graph
                    :layout="simpleLayout"
                    :origData="origData"
                    :stackOffset="stackOffset"
                    :hasAxes="false"
            />
        </div>

        <div v-else-if="interactivity === 'tooltip'">
            <h2>Streamgraph with tooltip</h2>
            <p>Hover over the graph for more information.</p>
            <StreamGraphToolTip :layout="layout" :stackOffset="stackOffset" :origData="origData"/>
        </div>

        <div v-else-if="interactivity === 'infobox'">
            <h2>Streamgraph with infobox</h2>
            <p>Select one of the </p>
            <StreamGraphInfobox :layout="layout" :stackOffset="stackOffset" :origData="origData"/>
        </div>

        <div v-else-if="interactivity === 'searchfield'">
            <h2>Streamgraph with search field</h2>
            <p>With the search field you can find a specific year on the timeline</p>
            <StreamGraphSearchField :layout="layout" :stackOffset="stackOffset" :origData="origData"/>
        </div>

        <div v-else>
            <h2>Streamgraph with bar chart</h2>
            <p>Hover over the graph for more information.</p>
            <StreamGraphBarChart :layout="layout" :stackOffset="stackOffset" :origData="origData"/>
        </div>
    </div>
</template>

<script>
import {
    csv as d3Csv,
    stackOffsetSilhouette,
    stackOffsetExpand,
    stackOffsetNone
} from "d3";

import StreamGraph from "./molecules/StreamGraph";
import StreamGraphBarChart from "./organismns/StreamGraphBarChart";
import StreamGraphInfobox from "./organismns/StreamGraphInfobox";
import StreamGraphSearchField from "./organismns/StreamGraphSearchField";
import StreamGraphToolTip from "./organismns/StreamGraphToolTip";

export default {
    name: "StreamGraphDemo",
    components: {
        StreamGraph,
        StreamGraphBarChart,
        StreamGraphInfobox,
        StreamGraphSearchField,
        StreamGraphToolTip,
    },
    data() {
        return {
            origData: [],
            simpleLayout: {
                width: 800,
                height: 400,
                margin: {top: 0, bottom: 0, left: 0, right: 0},
            },
            layout: {
                width: 800,
                height: 400,
                margin: {top: 50, bottom: 50, left: 70, right: 20},
            },
            interactivity: "barchart",
            interactivityOptions: [ "simple", "infobox", "tooltip", "searchfield", "barchart" ],
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
                {text: "time", value: "/data/thesisTime.csv"},
                {text: "family", value: "/data/family.csv"}
            ],
        };
    },
    methods: {
        async loadCSV() {
            await d3Csv(this.csvPath).then(data => {
                this.origData = data;
            });
        },
        async loadTimeStampCSV() {
            await d3Csv("data/timeStampData.csv").then(data => {
                this.timeStampData = data;
            });
        }
    },
    watch: {
        csvPath() {
            this.loadCSV();
        },
        interactivity() {
            this.loadCSV();
        }
    },
    mounted () {
        this.loadCSV();
        this.loadTimeStampCSV();
    },
}
</script>

<style scoped>
nav {
    position: sticky;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1em;
    background: white;
}

select {
    padding: 0.2em 1em;
    margin: 0 1em;
}
</style>