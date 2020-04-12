<template>
    <div id="app">
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
            <stream-graph :layout="layout" :stackOffset="stackOffset" :origData="origData"/>
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

import StreamGraph from "./components/molecules/StreamGraph";
import StreamGraphToolTip from "./components/organismns/StreamGraphToolTip";
import StreamGraphInfobox from "./components/organismns/StreamGraphInfobox";
import StreamGraphBarChart from "./components/organismns/StreamGraphBarChart";
import StreamGraphSearchField from "./components/organismns/StreamGraphSearchField";

export default {
    name: "app",
    components: {
        StreamGraphSearchField,
        StreamGraph,
        StreamGraphInfobox,
        StreamGraphToolTip,
        StreamGraphBarChart,
    },
    data() {
        return {
            origData: [],
            timeStampData: [],
            csvPath: "/data/office.csv",
            layout: {
                width: 800,
                height: 400,
                margin: {top: 50, bottom: 50, left: 70, right: 20}
            },
            stackOffset: stackOffsetNone,
            interactivity: "barchart",
            interactivityOptions: [ "simple", "infobox", "tooltip", "searchfield", "barchart" ],
            stackOffsetOptions: [
                {text: "Silhouette", value: stackOffsetSilhouette},
                {text: "Baseline", value: stackOffsetNone},
                {text: "Expand", value: stackOffsetExpand}
            ],
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
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
    opacity: 0;
}

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

.stream-graph {
    display: flex;
    justify-content: center;
}
</style>
