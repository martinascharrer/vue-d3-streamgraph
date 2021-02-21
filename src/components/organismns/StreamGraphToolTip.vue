<template>
    <div class="stream-graph">
        <InfoBox
            v-if="infobox.isVisible"
            :x="infobox.x"
            :y="infobox.y"
            :title="infobox.title"
            :text="infobox.text"
            :entries="infobox.entries"
        />
        <StreamGraph
            :layout="layout"
            :orig-data="origData"
            :stack-offset="stackOffset"
            :has-selector="true"
            :has-selector-dots="true"
            :y-axis-long="true"
            :x-axis-long="true"
            :color-array="colorArray"
            :color-interpolation="colorInterpolation"
            @mousemoved="updateInfoBox"
            @mouseleft="DeactivateInfobox"
        />
    </div>
</template>

<script>
import InfoBox from '../atoms/ToolTip.vue';
import StreamGraph from '../molecules/StreamGraph';

import { StreamGraphMixin } from '../mixins/StreamGraphMixin';

export default {
    name: 'StreamGraphToolTip',
    props: {
        origData: {
            type: Array,
            default: () => undefined
        },
        stackOffset: {
            type: Function,
        },
        layout: {
            type: Object,
            default: () => {
            }
        },
        colorArray: {
            type: Array,
        },
        colorInterpolation: {
            type: Function,
        },
    },
    data: function () {
        return {
            infobox: {
                title: 'title',
                x: 0,
                y: 0,
                isVisible: false,
                entries: null
            },
        };
    },
    components: {
        InfoBox,
        StreamGraph,
    },
    mixins: [StreamGraphMixin],
    methods: {
        DeactivateInfobox() {
            this.infobox.isVisible = false;
        },
        updateInfoBox(data, event) {
            // update the infobox
            let columns = this.origData.columns;
            let total = 0;
            let entries = [];
            for (let i = 1; i < columns.length; i++) {
                total += +data[columns[i]]; // calc total, + to convert from string to number
                // push the list-entries
                entries.push({
                    label: columns[i],
                    value: data[columns[i]],
                    color: this.color(columns[i])
                });
            }
            this.infobox = {
                title: data[this.xKey],
                text: 'Total: ' + total,
                entries: entries,
                x: event.pageX + 30,
                y: event.pageY + 30,
                isVisible: true,
            };
        },
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.7s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.stream-graph {
    display: flex;
    flex-direction: row;
    align-self: center;
    justify-content: center;
}

.selectedContainer {
    display: flex;
    flex-direction: column;
    width: 10vw;
    transition: all 1000ms;
}
</style>