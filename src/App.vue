<template>
    <div id="app">
        <nav>
            <label for="selectStackOffset">StackOffset</label>
            <select id="selectStackOffset" v-model="stackOffset">
                <option v-for="option in options" :value="option.value" :key="option.text">{{ option.text }}</option>
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

        <h2>Vue oriented</h2>
        <vue-stream-graph :layout="layout" :stackOffset="stackOffset" :origData="origData"/>

        <h2>D3 oriented</h2>
        <d3-stream-graph :layout="layout" :stackOffset="stackOffset" :origData="origData"/>

    </div>
</template>

<script>
    import {
        csv as d3Csv,
        stackOffsetSilhouette,
        stackOffsetExpand,
        stackOffsetNone
    } from "d3";
    import VueStreamGraph from "./components/organismns/VueStreamGraph";
    import D3StreamGraph from "./components/organismns/D3StreamGraph.vue";

    export default {
        name: "app",
        components: {
            VueStreamGraph,
            D3StreamGraph,
        },
        data() {
            return {
                origData: [],
                csvPath: "/data/steamChartData.csv",
                layout: {
                    width: 800,
                    height: 400,
                    margin: {top: 50, bottom: 50, left: 50, right: 40}
                },
                data: null,
                stackOffset: stackOffsetNone,
                options: [
                    {text: "Silhouette", value: stackOffsetSilhouette},
                    {text: "Baseline", value: stackOffsetNone},
                    {text: "Expand", value: stackOffsetExpand}
                ],
                dataOptions: [
                    {text: "office", value: "/data/office.csv"},
                    {text: "friends", value: "/data/steamChartData3.csv"},
                    {text: "insurance", value: "/data/insurance.csv"},
                    {text: "time", value: "/data/thesisTime.csv"},
                    {text: "tree", value: "/data/insurance2.csv"},
                    {text: "family", value: "/data/family.csv"}
                ]
            };
        },
        methods: {
            async loadCSV() {
                await d3Csv(this.csvPath).then(data => {
                    this.origData = data;
                });
            }
        },
        watch: {
            csvPath() {
                this.loadCSV();
            }
        },
        created() {
            this.loadCSV();
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

    h2 {
        padding-top: 2em;
    }
</style>
