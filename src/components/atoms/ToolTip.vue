<template>
    <transition name="fade">
        <div
            class="tolltip"
            :style="{transform: `translate(${x}px, ${y}px)`}"
        >
            <h2>{{ title }}</h2>
            <p v-if="text != null">
                {{ text }}
            </p>
            <ul v-if="entries != null" class="list">
                <li v-for="entry in entries" :key="entry.label">
                    <span
                        v-if="entry.color != null"
                        class="circle"
                        :style="{background: `${entry.color}`}"
                    />
                    <em>{{ entry.label }}</em>
                    {{ ': ' + entry.value }}
                </li>
            </ul>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'InfoBox',
    props: {
        x: {
            type: Number,
        },
        y: {
            type: Number,
        },
        title: {
            type: String,
            default: null,
        },
        text: {
            type: String,
            default: null,
        },
        w: {
            type: Number,
            default: 100,
        },
        h: {
            type: Number,
            default: 100,
        },
        entries: {
            type: Array,
            default: () => ['label', 'value', '#ddd'],
        },
    },
};
</script>

<style scoped>
.tolltip {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    background: white;
    padding: 1em;
    -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
    transition: opacity 300ms;
}

.list {
    padding: 0;
}

h2 {
    padding: 0.5em;
}

li {
    padding: 0.2em;
    list-style: none;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.circle {
    width: 10px;
    height: 10px;
    border-radius: 1em;
    margin: 0 0.5em;
}

em {
    font-style: normal;
    font-weight: bold;
}
</style>