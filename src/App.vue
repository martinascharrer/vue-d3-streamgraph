<template>
    <div id="app">
        <StreamGraphDemo/>
    </div>
</template>

<script>
import StreamGraphDemo from './components/StreamGraphDemo';

export default {
    name: 'app',
    components: {
        StreamGraphDemo,
    }
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
</style>
